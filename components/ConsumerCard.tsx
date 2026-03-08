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
  return (
    <div className="bg-white border border-white rounded-2xl shadow-[0px_4px_20px_-2px_rgba(19,109,236,0.08)] p-6 flex flex-col items-center flex-1 min-w-0">
      {/* Icon */}
      <div className="bg-slate-50 rounded-full size-20 flex items-center justify-center mb-4">
        <span className="text-3xl">{emoji}</span>
      </div>

      {/* Name */}
      <h4 className="text-base font-bold text-slate-900 text-center">{name}</h4>

      {/* Location */}
      <p className="text-sm text-slate-500 text-center mb-4">{location}</p>

      {/* Progress bar */}
      <div className="w-full bg-slate-100 h-2 rounded-full mb-2 overflow-hidden">
        <div
          className="bg-primary h-full rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Stats */}
      <div className="w-full flex items-center justify-between">
        <span className="text-sm font-bold text-primary">{percentage}%</span>
        <span className="text-sm font-bold text-slate-400">{kwh}</span>
      </div>
    </div>
  );
}
