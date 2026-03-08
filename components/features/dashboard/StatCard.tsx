import { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: string | ReactNode;
  prefix?: string;
  suffix?: string;
  badge?: ReactNode;
  footer?: ReactNode;
  icon?: ReactNode;
};

export default function StatCard({
  label,
  value,
  prefix,
  suffix,
  badge,
  footer,
  icon,
}: StatCardProps) {
  return (
    <div className="card bg-base-100 shadow-sm border border-base-200 flex-1 min-w-0 hover:shadow-md transition-shadow">
      <div className="card-body p-5 md:p-6 gap-1 relative">
        {/* Top-right decorative icon */}
        {icon && (
          <div className="absolute top-4 right-4 text-base-content/10">
            {icon}
          </div>
        )}

        {/* Label */}
        <p className="text-sm font-medium text-base-content/50">{label}</p>

        {/* Value */}
        <div className="flex items-baseline gap-2 pb-2">
          {prefix && (
            <span className="text-xl md:text-2xl font-bold text-base-content/40">{prefix}</span>
          )}
          {typeof value === "string" ? (
            <span className="text-3xl md:text-4xl font-black text-base-content">{value}</span>
          ) : (
            value
          )}
          {suffix && (
            <span className="text-lg md:text-xl font-bold text-base-content/40 uppercase">{suffix}</span>
          )}
        </div>

        {/* Badge / Footer */}
        {badge && badge}
        {footer && <div className="mt-1">{footer}</div>}
      </div>
    </div>
  );
}
