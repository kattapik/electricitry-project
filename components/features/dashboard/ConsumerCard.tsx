import * as React from "react";

type ConsumerCardProps = {
  name: string;
  location: string;
  percentage: number;
  kwh: string;
  emoji: string;
};

export default function ConsumerCard({
  name,
  location,
  percentage,
  kwh,
  emoji,
}: ConsumerCardProps) {
  // Clamp percentage between 0 and 100
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  return (
    <div className="bg-white border border-white rounded-2xl shadow-[0px_4px_20px_-2px_rgba(19,109,236,0.08)] p-4 md:p-5 flex flex-col items-center flex-1 min-w-0">
      {/* Icon */}
      <div className="bg-slate-50 rounded-full size-16 flex items-center justify-center mb-3 shrink-0">
        <span className="text-2xl">{emoji}</span>
      </div>

      {/* Name */}
      <h4 className="text-sm font-bold text-slate-900 text-center">{name}</h4>

      {/* Location */}
      <p className="text-xs text-slate-500 text-center mb-4 truncate w-full">{location}</p>

      {/* Progress bar */}
      <div className="w-full bg-slate-100 h-1.5 rounded-full mb-2 overflow-hidden shrink-0">
        <div
          className="bg-primary h-full rounded-full transition-all duration-300"
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>

      {/* Stats */}
      <div className="w-full flex items-center justify-between shrink-0">
        <span className="text-xs font-bold text-primary">{percentage}%</span>
        <span className="text-xs font-bold text-slate-400">{kwh}</span>
      </div>
    </div>
  );
}
