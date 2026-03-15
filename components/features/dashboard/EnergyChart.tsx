'use client';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useTranslations } from 'next-intl';

import type { DashboardChartPoint } from '@/lib/services/monthlyService';

interface EnergyChartProps {
  points: DashboardChartPoint[];
}

function formatUsage(value: number) {
  return `${value.toLocaleString('en-US', { maximumFractionDigits: 1 })} kWh`;
}

function formatTooltipValue(value: number | string | ReadonlyArray<number | string> | undefined): string {
  if (typeof value === 'number') {
    return formatUsage(value);
  }

  if (typeof value === 'string') {
    const numeric = Number(value);
    if (Number.isFinite(numeric)) {
      return formatUsage(numeric);
    }

    return value;
  }

  if (Array.isArray(value) && value.length > 0) {
    const first = value[0];
    if (typeof first === 'number') {
      return formatUsage(first);
    }

    if (typeof first === 'string') {
      const numeric = Number(first);
      return Number.isFinite(numeric) ? formatUsage(numeric) : first;
    }
  }

  return '0 kWh';
}

export default function EnergyChart({ points }: EnergyChartProps) {
  const t = useTranslations();

  if (points.length === 0) {
    return (
      <div className="card bg-base-100 shadow-sm border border-base-200 w-full overflow-hidden">
        <div className="card-body p-5 md:p-6 gap-2">
          <h3 className="text-lg font-bold text-base-content">{t('dashboard.actualVsForecast')}</h3>
          <p className="text-sm text-base-content/50">{t('dashboard.noChartData')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-sm border border-base-200 w-full overflow-hidden">
      <div className="card-body p-5 md:p-6 gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 sm:gap-0">
          <div>
              <h3 className="text-lg font-bold text-base-content">{t('dashboard.actualVsForecast')}</h3>
              <p className="text-sm text-base-content/50">{t('dashboard.realConsumptionTrend')}</p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(100, 116, 139, 0.2)" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: 'rgb(100, 116, 139)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(value) => `${value}`}
                tick={{ fontSize: 12, fill: 'rgb(100, 116, 139)' }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                formatter={(value, name) => [formatTooltipValue(value), name]}
                labelClassName="text-xs font-semibold"
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid rgba(148, 163, 184, 0.25)',
                  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />

              <Line
                type="monotone"
                dataKey="actualUsage"
                name={t('dashboard.actual')}
                stroke="#136dec"
                strokeWidth={2.5}
                dot={{ r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="forecastUsage"
                name={t('dashboard.forecast')}
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={{ r: 2, strokeWidth: 0 }}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
