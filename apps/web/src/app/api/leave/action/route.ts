import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendMail } from '@/lib/mailer'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ ok: false }, { status: 401 })

  const { leaveRequestId, action, managerComment } = await req.json()
  const oid = (session as any).oid
  const manager = await prisma.user.findUnique({ where: { entraOid: oid } })
  if (!manager) return NextResponse.json({ ok: false }, { status: 404 })

  const lr = await prisma.leaveRequest.findUnique({ where: { id: leaveRequestId }, include: { user: true, leaveType: true } })
  if (!lr) return NextResponse.json({ ok: false }, { status: 404 })

  const status = action === 'APPROVE' ? 'APPROVED' : 'REJECTED'
  const updated = await prisma.leaveRequest.update({
    where: { id: leaveRequestId },
    data: { status: status as any, managerComment, actionedById: manager.id, actionedAt: new Date() },
  })

  await sendMail({
    to: [lr.user.email],
    subject: `Leave ${status}: ${lr.leaveType.name}`,
    html: `<div style="font-family:Arial"><h2>Leave ${status}</h2><p>Comment: ${managerComment || '-'}</p></div>`,
  })

  return NextResponse.json({ ok: true, leaveRequest: updated })
}
