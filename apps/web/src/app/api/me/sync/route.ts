import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ ok: false }, { status: 401 })

  const oid = (session as any).oid
  const email = session.user.email!
  const upn = email
  const displayName = session.user.name || email

  if (!oid) return NextResponse.json({ ok: false, error: 'Missing oid claim' }, { status: 400 })

  const user = await prisma.user.upsert({
    where: { entraOid: oid },
    update: { email, upn, displayName },
    create: { entraOid: oid, email, upn, displayName },
  })

  return NextResponse.json({ ok: true, user })
}
