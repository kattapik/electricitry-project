import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type TrendBadgeProps = {
  text: string;
  trend: "up" | "down" | "neutral";
  /** Whether "up" is good (green) or bad (red). Default: false (up = bad/red, down = good/green for consumption) */
  upIsGood?: boolean;
};

export default function TrendBadge({ text, trend, upIsGood = false }: TrendBadgeProps) {
  const isPositive =
    trend === "neutral"
      ? null
      : (trend === "up" && upIsGood) || (trend === "down" && !upIsGood);

  const colorClasses =
    isPositive === null
      ? "bg-slate-100 text-slate-400"
      : isPositive
      ? "bg-green-50 text-green-600"
      : "bg-red-50 text-red-500";

  const Icon =
    trend === "up"
      ? TrendingUp
      : trend === "down"
      ? TrendingDown
      : Minus;

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold w-fit ${colorClasses}`}>
      <Icon size={12} />
      {text}
    </span>
  );
}
