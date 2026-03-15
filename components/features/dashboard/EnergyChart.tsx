import { DashboardChartPoint } from '@/lib/services/monthlyService';

interface EnergyChartProps {
  points: DashboardChartPoint[];
}

const CHART_WIDTH = 830;
const CHART_HEIGHT = 256;
const PADDING_X = 24;
const PADDING_TOP = 16;
const PADDING_BOTTOM = 32;

function linePath(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) {
    return '';
  }

  if (points.length === 1) {
    return `M${points[0].x},${points[0].y}`;
  }

  return points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x},${point.y}`).join(' ');
}

export default function EnergyChart({ points }: EnergyChartProps) {
  if (points.length === 0) {
    return (
      <div className="card bg-base-100 shadow-sm border border-base-200 w-full overflow-hidden">
        <div className="card-body p-5 md:p-6 gap-2">
          <h3 className="text-lg font-bold text-base-content">Forecast vs. Actual</h3>
          <p className="text-sm text-base-content/50">No monthly records available for charting yet.</p>
        </div>
      </div>
    );
  }

  const baselineY = CHART_HEIGHT - PADDING_BOTTOM;
  const chartMax = Math.max(
    1,
    ...points.flatMap((point) => [point.actualUsage, point.forecastUsage])
  );
  const chartRangeY = baselineY - PADDING_TOP;
  const xStep = points.length === 1 ? 0 : (CHART_WIDTH - PADDING_X * 2) / (points.length - 1);

  const actualPoints = points.map((point, index) => ({
    x: PADDING_X + xStep * index,
    y: baselineY - (point.actualUsage / chartMax) * chartRangeY,
  }));
  const forecastPoints = points.map((point, index) => ({
    x: PADDING_X + xStep * index,
    y: baselineY - (point.forecastUsage / chartMax) * chartRangeY,
  }));

  const actualLine = linePath(actualPoints);
  const forecastLine = linePath(forecastPoints);
  const actualFill = `${actualLine} L${actualPoints[actualPoints.length - 1].x},${baselineY} L${actualPoints[0].x},${baselineY} Z`;

  return (
    <div className="card bg-base-100 shadow-sm border border-base-200 w-full overflow-hidden">
      <div className="card-body p-5 md:p-6 gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 sm:gap-0">
          <div>
            <h3 className="text-lg font-bold text-base-content">Forecast vs. Actual</h3>
            <p className="text-sm text-base-content/50">Real consumption trend from monthly records</p>
          </div>
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <span className="badge badge-primary badge-xs rounded-full p-1.5" />
              <span className="text-xs font-semibold text-base-content/50 uppercase tracking-wider">Actual</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge badge-ghost badge-xs rounded-full p-1.5" />
              <span className="text-xs font-semibold text-base-content/50 uppercase tracking-wider">Forecast</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} className="w-full h-auto" preserveAspectRatio="none">
            <defs>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#136dec" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#136dec" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            <path d={actualFill} fill="url(#actualGradient)" />
            <path
              d={forecastLine}
              stroke="#cbd5e1"
              strokeWidth="2"
              strokeDasharray="8 4"
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={actualLine}
              stroke="#136dec"
              strokeWidth="2.5"
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <div className="flex items-center justify-between px-2">
            {points.map((point) => (
              <span key={point.slug} className="text-xs font-bold text-base-content/40 uppercase">
                {point.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
