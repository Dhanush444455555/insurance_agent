import React from 'react';
import { AlertCircle, CheckCircle, Flame, Layers } from 'lucide-react';

export default function RiskFactors({ factors = [] }) {
  const defaultFactors = [
    'High claim frequency',
    'High claim amount',
    'High-risk location',
  ];

  const factorList = factors && factors.length > 0 ? factors : defaultFactors;

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-700/60 shadow-lg">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
            Risk Factors & Adverse Indicators
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {factorList.length} Identified
        </span>
      </div>

      <div className="space-y-2.5">
        {factorList.map((factor, index) => {
          const isFavorable = typeof factor === 'string' && (
            factor.toLowerCase().includes('clean') ||
            factor.toLowerCase().includes('optimal') ||
            factor.toLowerCase().includes('no adverse')
          );

          return (
            <div
              key={index}
              className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                isFavorable
                  ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-200'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 text-slate-200'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isFavorable ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                )}
              </div>
              <div className="flex-1">
                <span className="text-xs font-medium leading-relaxed">
                  {typeof factor === 'string' ? factor : factor.name || JSON.stringify(factor)}
                </span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                isFavorable
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-rose-500/20 text-rose-300'
              }`}>
                {isFavorable ? 'Favorable' : 'Exposure'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
