export default function SkeletonCard() {
  return (
    <div className="bg-white/40 border border-slate-100 rounded-xl p-6 flex flex-col gap-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <div className="bg-slate-200 h-3 w-16 rounded" />
          <div className="bg-slate-200 h-6 w-32 rounded" />
        </div>
        <div className="bg-slate-100 rounded-full size-10" />
      </div>

      {/* Stats rows skeleton */}
      <div className="flex flex-col gap-4">
        <div className="bg-slate-100 h-12 rounded-lg" />
        <div className="bg-slate-100 h-12 rounded-lg" />
      </div>

      {/* Footer skeleton */}
      <div className="border-t border-slate-50 pt-4">
        <div className="bg-slate-100 h-3 w-40 rounded" />
      </div>
    </div>
  );
}
