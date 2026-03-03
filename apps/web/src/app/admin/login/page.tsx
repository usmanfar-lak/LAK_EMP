'use client'

import { useState } from 'react'

export default function AdminLogin() {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    if (res.ok) window.location.href = '/admin'
    else setError('Invalid credentials')
  }

  return (
    <main className="min-h-screen grid place-items-center bg-slate-50">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold">Admin Login</h1>
        <div className="mt-6 space-y-3">
          <input className="w-full rounded-xl border px-3 py-2" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
          <input className="w-full rounded-xl border px-3 py-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button className="w-full rounded-xl bg-slate-900 py-2 text-white">Sign in</button>
        </div>
      </form>
    </main>
  )
}
