export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="rounded-3xl border border-slate-200 bg-white px-8 py-8 text-center shadow-sm">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        <p className="mt-4 text-sm font-medium text-slate-600">Loading the page…</p>
      </div>
    </div>
  );
}
