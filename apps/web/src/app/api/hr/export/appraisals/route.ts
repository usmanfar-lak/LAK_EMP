import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { toCsv } from '@/lib/csv'

export async function GET() {
  const session = await auth()
  const roles: string[] = (session as any)?.roles ?? []
  if (!session?.user || !roles.includes(process.env.ROLE_HR!)) return NextResponse.json({ ok: false }, { status: 403 })

  const apps = await prisma.appraisal.findMany({ include: { user: true, review: true }, orderBy: { updatedAt: 'desc' } })
  const csv = toCsv(
    apps.map((a) => ({
      id: a.id,
      employee: a.user.displayName,
      email: a.user.email,
      cycleYear: a.cycleYear,
      selfRating: a.selfRating,
      status: a.status,
      submittedAt: a.submittedAt?.toISOString() ?? '',
      managerRating: a.review?.managerRating ?? '',
      managerComment: a.review?.managerComment ?? '',
      reviewedAt: a.review?.reviewedAt?.toISOString() ?? '',
    }))
  )

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="appraisals.csv"',
    },
  })
}
