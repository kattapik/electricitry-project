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
    <div className="bg-white border border-white rounded-2xl shadow-[0px_4px_20px_-2px_rgba(19,109,236,0.08)] p-8 flex-1 flex flex-col gap-1 overflow-hidden relative min-w-0">
      {/* Top-right decorative icon */}
      {icon && (
        <div className="absolute top-4 right-4 text-slate-200 opacity-60">
          {icon}
        </div>
      )}

      {/* Label */}
      <p className="text-base font-medium text-slate-500">{label}</p>

      {/* Value */}
      <div className="flex items-baseline gap-2 pb-3">
        {prefix && (
          <span className="text-2xl font-bold text-slate-400">{prefix}</span>
        )}
        {typeof value === "string" ? (
          <span className="text-4xl font-black text-slate-900">{value}</span>
        ) : (
          value
        )}
        {suffix && (
          <span className="text-xl font-bold text-slate-400 uppercase">{suffix}</span>
        )}
      </div>

      {/* Badge / Footer */}
      {badge && badge}
      {footer && <div className="mt-1">{footer}</div>}
    </div>
  );
}
