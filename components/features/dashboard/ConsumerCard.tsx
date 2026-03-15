import * as React from "react";
import Image from "next/image";

type ConsumerCardProps = {
  name: string;
  location: string;
  percentage: number;
  kwh: string;
  imageUrl?: string;
};

export default function ConsumerCard({
  name,
  location,
  percentage,
  kwh,
  imageUrl,
}: ConsumerCardProps) {
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  const hasImage = imageUrl && (imageUrl.startsWith('http') || imageUrl.startsWith('data:'));

  return (
    <div className="card bg-base-100 shadow-sm border border-base-200 flex-1 min-w-0 hover:shadow-md transition-shadow">
      <div className="card-body p-4 md:p-5 items-center gap-0">
        {/* Icon/Image */}
        <div className="bg-base-200/60 rounded-full size-14 flex items-center justify-center mb-3 shrink-0 overflow-hidden">
          {hasImage ? (
            <Image
              src={imageUrl}
              alt={name}
              width={56}
              height={56}
              className="size-full object-cover"
              unoptimized
            />
          ) : (
            <span className="text-2xl">{imageUrl || '🔌'}</span>
          )}
        </div>

        {/* Name */}
        <h4 className="text-sm font-bold text-base-content text-center">{name}</h4>

        {/* Location */}
        <p className="text-xs text-base-content/50 text-center mb-4 truncate w-full">{location}</p>

        {/* Progress bar */}
        <progress
          className="progress progress-primary w-full h-1.5 mb-2"
          value={clampedPercentage}
          max="100"
        />

        {/* Stats */}
        <div className="w-full flex items-center justify-between shrink-0">
          <span className="text-xs font-bold text-primary">{percentage}%</span>
          <span className="text-xs font-bold text-base-content/40">{kwh}</span>
        </div>
      </div>
    </div>
  );
}
