import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

const rules: Array<{ prefix: string; roles: string[] }> = [
  { prefix: '/employee', roles: [process.env.ROLE_EMPLOYEE!, process.env.ROLE_MANAGER!, process.env.ROLE_HR!] },
  { prefix: '/manager', roles: [process.env.ROLE_MANAGER!] },
  { prefix: '/hr', roles: [process.env.ROLE_HR!] },
]

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  if (path.startsWith('/admin')) return NextResponse.next()
  if (path === '/' || path.startsWith('/api/auth') || path.startsWith('/unauthorized')) return NextResponse.next()

  const rule = rules.find((r) => path.startsWith(r.prefix))
  if (!rule) return NextResponse.next()

  const session = await auth()
  if (!session?.user) return NextResponse.redirect(new URL('/', req.url))

  const roles: string[] = (session as any).roles ?? []
  const ok = rule.roles.some((r) => roles.includes(r))
  if (!ok) return NextResponse.redirect(new URL('/unauthorized', req.url))

  return NextResponse.next()
}

export const config = {
  matcher: ['/employee/:path*', '/manager/:path*', '/hr/:path*', '/((?!_next/static|_next/image|favicon.ico).*)'],
}
