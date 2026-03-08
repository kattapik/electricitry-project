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

  const badgeClass =
    isPositive === null
      ? "badge-ghost text-base-content/40"
      : isPositive
      ? "badge-success badge-soft"
      : "badge-error badge-soft";

  const Icon =
    trend === "up"
      ? TrendingUp
      : trend === "down"
      ? TrendingDown
      : Minus;

  return (
    <span className={`badge gap-1.5 px-3 py-3 text-xs font-semibold ${badgeClass}`}>
      <Icon size={12} />
      {text}
    </span>
  );
}
