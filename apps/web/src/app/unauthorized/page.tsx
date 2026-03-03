export default function Unauthorized() {
  return (
    <main className="min-h-screen grid place-items-center bg-slate-50">
      <div className="max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold">Unauthorized</h1>
        <p className="mt-2 text-sm text-slate-600">You do not have access to this module.</p>
      </div>
    </main>
  )
}
