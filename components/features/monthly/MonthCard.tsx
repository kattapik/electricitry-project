import { ChevronRight, Zap, DollarSign, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type MonthCardProps = {
  month: string;
  year: string;
  totalUsage: string;
  monthlyCost: string;
  trendText: string;
  trendType: "positive" | "negative" | "neutral";
  isLatest?: boolean;
};

export default function MonthCard({
  month,
  year,
  totalUsage,
  monthlyCost,
  trendText,
  trendType,
  isLatest = false,
}: MonthCardProps) {
  const trendColor =
    trendType === "positive"
      ? "text-green-500"
      : trendType === "negative"
      ? "text-red-500"
      : "text-slate-400";

  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span
            className={`text-xs font-bold uppercase tracking-wider ${
              isLatest ? "text-primary" : "text-slate-400"
            }`}
          >
            {isLatest ? "Latest Period" : "Historical"}
          </span>
          <h3 className="text-2xl font-bold text-slate-900">
            {month} {year}
          </h3>
        </div>
        <Button
          variant={isLatest ? "primary" : "secondary"}
          size="icon"
          className={cn(
            "size-10 rounded-full shrink-0",
            isLatest ? "bg-primary-subtle text-primary shadow-none hover:bg-primary/20" : "text-slate-400"
          )}
          aria-label={`View details for ${month}`}
        >
          <ChevronRight size={16} />
        </Button>
      </div>

      {/* Stats rows */}
      <div className="flex flex-col gap-4">
        <div className="bg-slate-50 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-slate-500" />
            <span className="text-sm font-medium text-slate-600">Total Usage</span>
          </div>
          <span className="text-lg font-bold text-slate-900">{totalUsage}</span>
        </div>
        <div className="bg-slate-50 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign size={16} className="text-slate-500" />
            <span className="text-sm font-medium text-slate-600">Monthly Cost</span>
          </div>
          <span className="text-lg font-bold text-primary">{monthlyCost}</span>
        </div>
      </div>

      {/* Trend footer */}
      <div className="border-t border-slate-50 pt-4 flex items-center gap-2">
        {trendType === "negative" ? (
          <TrendingUp size={12} className={trendColor} />
        ) : trendType === "positive" ? (
          <TrendingDown size={12} className={trendColor} />
        ) : (
          <Minus size={12} className={trendColor} />
        )}
        <span className={`text-xs font-medium ${trendColor}`}>{trendText}</span>
      </div>
    </div>
  );
}
