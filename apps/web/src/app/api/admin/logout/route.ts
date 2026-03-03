import { NextResponse } from 'next/server'
import { adminLogout } from '@/lib/admin-session'

export async function POST() {
  adminLogout()
  return NextResponse.json({ ok: true })
}
