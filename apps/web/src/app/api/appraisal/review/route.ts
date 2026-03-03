import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendMail } from '@/lib/mailer'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ ok: false }, { status: 401 })

  const { appraisalId, managerRating, managerComment } = await req.json()
  const oid = (session as any).oid

  const manager = await prisma.user.findUnique({ where: { entraOid: oid } })
  if (!manager) return NextResponse.json({ ok: false }, { status: 404 })

  const appraisal = await prisma.appraisal.findUnique({ where: { id: appraisalId }, include: { user: true } })
  if (!appraisal) return NextResponse.json({ ok: false }, { status: 404 })

  const review = await prisma.appraisalReview.upsert({
    where: { appraisalId },
    update: { managerId: manager.id, managerRating: Number(managerRating), managerComment, reviewedAt: new Date() },
    create: { appraisalId, managerId: manager.id, managerRating: Number(managerRating), managerComment },
  })

  await prisma.appraisal.update({ where: { id: appraisalId }, data: { status: 'REVIEWED' } })

  await sendMail({
    to: [appraisal.user.email],
    subject: `Appraisal Reviewed (${appraisal.cycleYear})`,
    html: `<div style="font-family:Arial"><h2>Reviewed</h2><p>Rating: ${managerRating}</p></div>`,
  })

  return NextResponse.json({ ok: true, review })
}
