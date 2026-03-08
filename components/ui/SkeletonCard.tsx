export default function SkeletonCard() {
  return (
    <div className="card bg-base-100 shadow-sm border border-base-200 animate-pulse">
      <div className="card-body p-5 gap-4">
        {/* Header skeleton */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <div className="skeleton h-4 w-20 rounded" />
            <div className="skeleton h-6 w-32 rounded" />
          </div>
          <div className="skeleton rounded-full size-8" />
        </div>

        {/* Stats rows skeleton */}
        <div className="flex flex-col gap-2">
          <div className="skeleton h-11 rounded-lg" />
          <div className="skeleton h-11 rounded-lg" />
        </div>

        {/* Footer skeleton */}
        <div className="divider my-0"></div>
        <div className="-mt-2">
          <div className="skeleton h-3 w-40 rounded" />
        </div>
      </div>
    </div>
  );
}
