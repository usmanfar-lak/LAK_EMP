import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendMail } from '@/lib/mailer'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ ok: false }, { status: 401 })

  const { leaveTypeId, startDate, endDate, reason, days } = await req.json()
  const oid = (session as any).oid

  const me = await prisma.user.findUnique({ where: { entraOid: oid }, include: { manager: true } })
  if (!me) return NextResponse.json({ ok: false, error: 'User not found. Call /api/me/sync first.' }, { status: 404 })
  if (!me.manager?.email) return NextResponse.json({ ok: false, error: 'No manager assigned.' }, { status: 400 })

  const lr = await prisma.leaveRequest.create({
    data: {
      userId: me.id,
      leaveTypeId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      days: Number(days),
      status: 'PENDING',
    },
    include: { leaveType: true },
  })

  await sendMail({
    to: [me.manager.email],
    subject: `Leave Request Pending: ${me.displayName}`,
    html: `<div style="font-family:Arial"><h2>Leave Request Submitted</h2><p>Employee: ${me.displayName}</p><p>Type: ${lr.leaveType.name}</p></div>`,
  })

  return NextResponse.json({ ok: true, leaveRequest: lr })
}
