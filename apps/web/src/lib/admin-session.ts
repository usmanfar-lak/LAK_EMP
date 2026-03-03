import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

const COOKIE = 'lakarya_admin'
const SECRET = process.env.NEXTAUTH_SECRET!

export async function adminLogin(username: string, password: string) {
  if (username !== process.env.ADMIN_USERNAME) return false
  const ok = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH!)
  if (!ok) return false
  const token = jwt.sign({ a: true, u: username }, SECRET, { expiresIn: '12h' })
  cookies().set(COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: true, path: '/' })
  return true
}

export function adminLogout() {
  cookies().delete(COOKIE)
}

export function requireAdmin() {
  const token = cookies().get(COOKIE)?.value
  if (!token) return false
  try {
    const decoded = jwt.verify(token, SECRET) as any
    return decoded?.a === true
  } catch {
    return false
  }
}
