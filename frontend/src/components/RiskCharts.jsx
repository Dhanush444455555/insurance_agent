import React, { useState } from 'react';
import { PieChart as PieIcon, BarChart3, TrendingUp, Info } from 'lucide-react';

export default function RiskCharts({ dimensionScores = [], exposureDistribution = [] }) {
  const [hoveredSlice, setHoveredSlice] = useState(null);

  const defaultDimensions = [
    { dimension: 'Claims Propensity', score: 78, benchmark: 35 },
    { dimension: 'Territorial Hazard', score: 85, benchmark: 45 },
    { dimension: 'Vehicle Severity', score: 72, benchmark: 40 },
    { dimension: 'Financial Exposure', score: 65, benchmark: 38 },
  ];

  const defaultDistribution = [
    { name: 'Claims Loss History', value: 38, color: '#f43f5e' },
    { name: 'Territorial Risk', value: 27, color: '#06b6d4' },
    { name: 'Vehicle Risk Class', value: 21, color: '#818cf8' },
    { name: 'Demographic Exposure', value: 14, color: '#f59e0b' },
  ];

  const dimensions = dimensionScores.length > 0 ? dimensionScores : defaultDimensions;
  const distribution = exposureDistribution.length > 0 ? exposureDistribution : defaultDistribution;

  // Pie chart geometry calculation
  const total = distribution.reduce((sum, item) => sum + item.value, 0) || 100;
  let cumulativeAngle = 0;

  const slices = distribution.map((item) => {
    const percentage = item.value / total;
    const angle = percentage * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle = endAngle;

    // Convert polar to cartesian
    const radius = 80;
    const innerRadius = 48; // Donut hole
    const cx = 100;
    const cy = 100;

    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);

    const x3 = cx + innerRadius * Math.cos(endRad);
    const y3 = cy + innerRadius * Math.sin(endRad);
    const x4 = cx + innerRadius * Math.cos(startRad);
    const y4 = cy + innerRadius * Math.sin(startRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const pathData = `
      M ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}
      Z
    `;

    return {
      ...item,
      pathData,
      startAngle,
      endAngle,
      percentage: Math.round(percentage * 100),
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Chart 1: Donut / Pie Chart - Risk Factor Composition */}
      <div className="lg:col-span-6 glass-panel rounded-2xl p-6 border border-slate-700/60 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-slate-100 tracking-tight">
                Risk Exposure Composition
              </h3>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded-full">
              Donut Analysis
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 my-2">
            {/* SVG Donut Chart */}
            <div className="relative w-48 h-48 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                {slices.map((slice, index) => {
                  const isHovered = hoveredSlice === index;
                  return (
                    <path
                      key={index}
                      d={slice.pathData}
                      fill={slice.color}
                      className="cursor-pointer transition-all duration-300 hover:opacity-90"
                      style={{
                        transformOrigin: '100px 100px',
                        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                        filter: isHovered ? 'drop-shadow(0 0 8px rgba(255,255,255,0.3))' : 'none',
                      }}
                      onMouseEnter={() => setHoveredSlice(index)}
                      onMouseLeave={() => setHoveredSlice(null)}
                    />
                  );
                })}
              </svg>

              {/* Donut Center Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                {hoveredSlice !== null ? (
                  <>
                    <span className="text-lg font-bold font-mono text-white">
                      {slices[hoveredSlice].percentage}%
                    </span>
                    <span className="text-[9px] text-slate-400 max-w-[70px] truncate">
                      {slices[hoveredSlice].name}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                      Total
                    </span>
                    <span className="text-base font-extrabold text-cyan-400 font-mono">
                      100%
                    </span>
                    <span className="text-[9px] text-slate-500">Factors</span>
                  </>
                )}
              </div>
            </div>

            {/* Legend */}
            <div className="flex-1 w-full space-y-2.5">
              {slices.map((slice, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
                    hoveredSlice === idx
                      ? 'bg-slate-800/90 border-cyan-500/50'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                  onMouseEnter={() => setHoveredSlice(idx)}
                  onMouseLeave={() => setHoveredSlice(null)}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: slice.color }}
                    />
                    <span className="text-xs text-slate-300 truncate font-medium">
                      {slice.name}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-100 ml-2">
                    {slice.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>Proportional loss probability weight computed across historical variables.</span>
        </div>
      </div>

      {/* Chart 2: Multi-Dimension Bar Graph (Customer vs Industry Benchmark) */}
      <div className="lg:col-span-6 glass-panel rounded-2xl p-6 border border-slate-700/60 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-slate-100 tracking-tight">
                Actuarial Risk Dimensions vs Benchmark
              </h3>
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1 text-cyan-400 font-mono">
                <span className="w-2 h-2 rounded bg-cyan-400 inline-block"></span> Profile
              </span>
              <span className="flex items-center gap-1 text-slate-400 font-mono">
                <span className="w-2 h-2 rounded bg-slate-600 inline-block"></span> Benchmark
              </span>
            </div>
          </div>

          {/* Bar Items */}
          <div className="space-y-4 my-2">
            {dimensions.map((dim, idx) => {
              const isHigher = dim.score > dim.benchmark;
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-300">{dim.dimension}</span>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-slate-100 font-bold">{dim.score}</span>
                      <span className="text-slate-500">/ avg {dim.benchmark}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                        isHigher ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {isHigher ? `+${dim.score - dim.benchmark}` : `${dim.score - dim.benchmark}`}
                      </span>
                    </div>
                  </div>

                  {/* Dual Bar Graphic */}
                  <div className="relative w-full h-3.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    {/* Customer Score Bar */}
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        dim.score >= 70
                          ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                          : dim.score >= 40
                          ? 'bg-gradient-to-r from-cyan-500 to-indigo-500'
                          : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      }`}
                      style={{ width: `${Math.min(dim.score, 100)}%` }}
                    />

                    {/* Benchmark vertical pin indicator */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-white shadow-sm z-10"
                      style={{ left: `${dim.benchmark}%` }}
                      title={`Industry Benchmark: ${dim.benchmark}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span className="font-mono text-[10px] text-slate-500">Vertical white line = Regional Standard</span>
          <span className="font-mono text-[10px] text-cyan-400 font-semibold">Model: Actuarial-Index v4</span>
        </div>
      </div>
    </div>
  );
}
