import { ChevronRight, Zap, Coins, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/app/i18n/routing';
import { cn } from '@/lib/utils';
import { localizeMonthName, localizeTrendText } from '@/lib/i18n/localize';

type MonthCardProps = {
  slug: string;
  month: string;
  year: string;
  totalUsage: string;
  monthlyCost: string;
  trendText: string;
  trendType: 'positive' | 'negative' | 'neutral';
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
  const t = useTranslations();
  const trendConfig = {
    positive: { color: 'text-success', icon: TrendingDown },
    negative: { color: 'text-error', icon: TrendingUp },
    neutral: { color: 'text-base-content/40', icon: Minus },
  };

  const { color: trendColor, icon: TrendIcon } = trendConfig[trendType];

  const localizedMonth = localizeMonthName(month, t);

  return (
    <Link
      href={`/monthly/${slug}`}
      className="block card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/30"
      aria-label={t('monthly.viewDetailsForMonth', { month: localizedMonth, year })}
    >
      <div className="card-body p-5 gap-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span
              className={cn(
                'badge badge-sm font-bold uppercase tracking-wider',
                isLatest ? 'badge-primary badge-soft' : 'badge-ghost text-base-content/40'
              )}
            >
               {isLatest ? t('monthly.latestPeriod') : t('monthly.historical')}
             </span>
             <h3 className="text-xl font-bold text-base-content mt-1">
               {localizedMonth} {year}
             </h3>
          </div>
          <span
            className={cn(
              'btn btn-circle btn-sm',
              isLatest ? 'btn-primary btn-soft' : 'btn-ghost text-base-content/30'
            )}
            aria-hidden
          >
            <ChevronRight size={16} />
          </span>
        </div>

        <div className="flex flex-col gap-4 rounded-xl">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between bg-base-200/50 rounded-lg px-3 py-2.5">
              <div className="flex items-center gap-2 text-base-content/60">
                 <Zap size={14} />
                 <span className="text-sm font-medium">{t('monthly.totalUsage')}</span>
               </div>
              <span className="text-base font-bold text-base-content">{totalUsage}</span>
            </div>
            <div className="flex items-center justify-between bg-base-200/50 rounded-lg px-3 py-2.5">
              <div className="flex items-center gap-2 text-base-content/60">
                 <Coins size={14} />
                 <span className="text-sm font-medium">{t('monthly.monthlyCost')}</span>
               </div>
              <span className="text-base font-bold text-primary">{monthlyCost}</span>
            </div>
          </div>

          <div className="divider my-0"></div>
          {(roomCount || applianceCount) && (
            <div className="flex items-center gap-2 text-xs text-base-content/45 -mt-2">
              <span>{t('monthly.roomsCount', { count: roomCount ?? 0 })}</span>
              <span className="text-base-content/20">/</span>
              <span>{t('monthly.appliancesCount', { count: applianceCount ?? 0 })}</span>
            </div>
          )}
          <div className={cn('flex items-center gap-1.5 -mt-2', trendColor)}>
            <TrendIcon size={12} />
            <span className="text-xs font-medium">{localizeTrendText(trendText, t)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
