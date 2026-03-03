import Link from 'next/link'

export default function AdminHome() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <p className="mt-2 text-slate-600">Manage users, roles mapping, departments, holidays, leave policies.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Link className="rounded-2xl border bg-white p-6 shadow-sm" href="/admin/users">Users & Roles</Link>
          <Link className="rounded-2xl border bg-white p-6 shadow-sm" href="/admin/departments">Departments</Link>
          <Link className="rounded-2xl border bg-white p-6 shadow-sm" href="/admin/holidays">Holidays</Link>
          <Link className="rounded-2xl border bg-white p-6 shadow-sm" href="/admin/settings">Settings</Link>
        </div>
      </div>
    </main>
  )
}
