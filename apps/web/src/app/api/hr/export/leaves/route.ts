import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { toCsv } from '@/lib/csv'

export async function GET() {
  const session = await auth()
  const roles: string[] = (session as any)?.roles ?? []
  if (!session?.user || !roles.includes(process.env.ROLE_HR!)) return NextResponse.json({ ok: false }, { status: 403 })

  const leaves = await prisma.leaveRequest.findMany({ include: { user: true, leaveType: true }, orderBy: { createdAt: 'desc' } })
  const csv = toCsv(
    leaves.map((l) => ({
      id: l.id,
      employee: l.user.displayName,
      email: l.user.email,
      type: l.leaveType.name,
      startDate: l.startDate.toISOString(),
      endDate: l.endDate.toISOString(),
      days: l.days,
      status: l.status,
      reason: l.reason,
      managerComment: l.managerComment ?? '',
      submittedAt: l.createdAt.toISOString(),
    }))
  )

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="leaves.csv"',
    },
  })
}
