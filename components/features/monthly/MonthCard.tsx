'use client';

import { ChevronRight, Zap, Coins, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

type MonthCardProps = {
  slug: string;
  month: string;
  year: string;
  totalUsage: string;
  monthlyCost: string;
  trendText: string;
  trendType: "positive" | "negative" | "neutral";
  roomCount?: number;
  applianceCount?: number;
  isLatest?: boolean;
};

export default function MonthCard({
  slug,
  month,
  year,
  totalUsage,
  monthlyCost,
  trendText,
  trendType,
  roomCount,
  applianceCount,
  isLatest = false,
}: MonthCardProps) {
  const router = useRouter();

  const trendConfig = {
    positive: { color: "text-success", icon: TrendingDown },
    negative: { color: "text-error", icon: TrendingUp },
    neutral: { color: "text-base-content/40", icon: Minus },
  };

  const { color: trendColor, icon: TrendIcon } = trendConfig[trendType];
  const monthHref = `/monthly/${slug}`;
  const openMonthDetails = () => router.push(monthHref);

  return (
    <div
      className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow block outline-none focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30 cursor-pointer"
      role="button"
      tabIndex={0}
      onClick={openMonthDetails}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openMonthDetails();
        }
      }}
      aria-label={`View details for ${month} ${year}`}
    >
      <div className="card-body p-5 gap-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span
              className={cn(
                "badge badge-sm font-bold uppercase tracking-wider",
                isLatest ? "badge-primary badge-soft" : "badge-ghost text-base-content/40"
              )}
            >
              {isLatest ? "Latest Period" : "Historical"}
            </span>
            <h3 className="text-xl font-bold text-base-content mt-1">
              {month} {year}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={cn(
                'btn btn-circle btn-sm',
                isLatest ? 'btn-primary btn-soft' : 'btn-ghost text-base-content/30'
              )}
              aria-label={`Go to ${month} ${year}`}
              onClick={(event) => {
                event.stopPropagation();
                openMonthDetails();
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-xl">
          {/* Stats */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between bg-base-200/50 rounded-lg px-3 py-2.5">
              <div className="flex items-center gap-2 text-base-content/60">
                <Zap size={14} />
                <span className="text-sm font-medium">Total Usage</span>
              </div>
              <span className="text-base font-bold text-base-content">{totalUsage}</span>
            </div>
            <div className="flex items-center justify-between bg-base-200/50 rounded-lg px-3 py-2.5">
              <div className="flex items-center gap-2 text-base-content/60">
                <Coins size={14} />
                <span className="text-sm font-medium">Monthly Cost</span>
              </div>
              <span className="text-base font-bold text-primary">{monthlyCost}</span>
            </div>
          </div>

          {/* Trend footer */}
          <div className="divider my-0"></div>
          {(roomCount || applianceCount) && (
            <div className="flex items-center gap-2 text-xs text-base-content/45 -mt-2">
              <span>{roomCount ?? 0} rooms</span>
              <span className="text-base-content/20">/</span>
              <span>{applianceCount ?? 0} appliances</span>
            </div>
          )}
          <div className={cn('flex items-center gap-1.5 -mt-2', trendColor)}>
            <TrendIcon size={12} />
            <span className="text-xs font-medium">{trendText}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
