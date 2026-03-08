export default function EnergyChart() {
  // SVG area chart mimicking the Figma "Forecast vs. Actual" design
  const months = ["MAY", "JUN", "JUL", "AUG", "SEP", "OCT"];
  
  // Actual usage data (solid line with fill)
  const actualPath = "M0,180 C40,170 80,160 138,120 C196,80 250,75 332,60 C414,45 450,50 498,80 C546,110 610,30 664,15 C718,0 770,20 830,45";
  const actualFill = `${actualPath} L830,256 L0,256 Z`;
  
  // Forecast data (dashed line)
  const forecastPath = "M0,180 C60,175 120,155 180,135 C240,115 300,100 360,95 C420,90 480,85 540,70 C600,55 660,50 720,55 C780,60 810,65 830,70";

  return (
    <div className="bg-white border border-white rounded-2xl shadow-[0px_4px_20px_-2px_rgba(19,109,236,0.08)] p-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Forecast vs. Actual</h3>
          <p className="text-base text-slate-500">Consumption trends for the last 6 months</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-primary" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Actual</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-slate-300" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Forecast</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex flex-col gap-4">
        <svg viewBox="0 0 830 256" className="w-full h-auto" preserveAspectRatio="none">
          <defs>
            <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#136dec" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#136dec" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          
          {/* Actual fill area */}
          <path d={actualFill} fill="url(#actualGradient)" />
          
          {/* Forecast dashed line */}
          <path d={forecastPath} stroke="#cbd5e1" strokeWidth="2" strokeDasharray="8 4" fill="none" />
          
          {/* Actual solid line */}
          <path d={actualPath} stroke="#136dec" strokeWidth="2.5" fill="none" />
        </svg>

        {/* X-axis labels */}
        <div className="flex items-center justify-between px-2">
          {months.map((month) => (
            <span key={month} className="text-xs font-bold text-slate-400 uppercase">
              {month}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
