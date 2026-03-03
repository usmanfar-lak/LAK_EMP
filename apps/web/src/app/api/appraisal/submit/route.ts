import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendMail } from '@/lib/mailer'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ ok: false }, { status: 401 })

  const { cycleYear, selfReview, achievements, goals, selfRating } = await req.json()
  const oid = (session as any).oid

  const me = await prisma.user.findUnique({ where: { entraOid: oid }, include: { manager: true } })
  if (!me) return NextResponse.json({ ok: false }, { status: 404 })
  if (!me.manager?.email) return NextResponse.json({ ok: false, error: 'No manager assigned.' }, { status: 400 })

  const appraisal = await prisma.appraisal.upsert({
    where: { userId_cycleYear: { userId: me.id, cycleYear: Number(cycleYear) } },
    update: { selfReview, achievements, goals, selfRating: Number(selfRating), status: 'SUBMITTED', submittedAt: new Date() },
    create: { userId: me.id, cycleYear: Number(cycleYear), selfReview, achievements, goals, selfRating: Number(selfRating), status: 'SUBMITTED', submittedAt: new Date() },
  })

  await sendMail({
    to: [me.manager.email],
    subject: `Appraisal Submitted: ${me.displayName} (${cycleYear})`,
    html: `<div style="font-family:Arial"><h2>Appraisal Submitted</h2><p>${me.displayName}</p></div>`,
  })

  return NextResponse.json({ ok: true, appraisal })
}
