import { NextResponse } from 'next/server'
import { adminLogin } from '@/lib/admin-session'

export async function POST(req: Request) {
  const { username, password } = await req.json()
  const ok = await adminLogin(username, password)
  return NextResponse.json({ ok }, { status: ok ? 200 : 401 })
}
