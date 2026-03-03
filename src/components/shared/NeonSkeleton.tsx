export default function NeonSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 h-10 w-72 animate-pulse rounded bg-emerald-500/20" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-xl border border-emerald-500/20 bg-black/20 p-6">
            <div className="mb-4 h-4 w-24 animate-pulse rounded bg-emerald-500/30" />
            <div className="mb-3 h-6 w-4/5 animate-pulse rounded bg-emerald-500/20" />
            <div className="mb-2 h-4 w-full animate-pulse rounded bg-emerald-500/10" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-emerald-500/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
