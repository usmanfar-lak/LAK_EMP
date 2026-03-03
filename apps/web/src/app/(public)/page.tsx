import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-white p-2 shadow-sm border">
            <Image src="/lakarya-logo.png" alt="Lakarya" width={54} height={54} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Lakarya Employee Self Service</h1>
            <p className="text-sm text-slate-600">Digital Simplified — Leave, Appraisals, HR & Manager workflows</p>
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/employee" className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="font-semibold">Employee</div>
            <div className="text-sm text-slate-600">Apply leave, submit appraisal, update profile</div>
          </Link>
          <Link href="/manager" className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="font-semibold">Manager</div>
            <div className="text-sm text-slate-600">Approvals & team overview</div>
          </Link>
          <Link href="/hr" className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="font-semibold">HR</div>
            <div className="text-sm text-slate-600">Visibility, reporting, exports</div>
          </Link>
          <Link href="/admin/login" className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="font-semibold">Admin</div>
            <div className="text-sm text-slate-600">System configuration</div>
          </Link>
        </div>

        <div className="mt-8 rounded-2xl border bg-slate-900 p-6 text-white">
          <p className="text-sm text-slate-200">
            Use Microsoft sign-in for Employee/Manager/HR. Admin uses local login.
          </p>
          <p className="mt-3 text-sm">
            Go to <code className="px-2 py-1 bg-slate-800 rounded">/api/auth/signin</code> to sign in.
          </p>
        </div>
      </div>
    </main>
  )
}
