import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Activity, ShieldAlert } from 'lucide-react';

export default function RiskCard({ riskScore = 78, riskLevel = 'HIGH' }) {
  const normalizedLevel = (riskLevel || 'MEDIUM').toUpperCase();

  const getTheme = () => {
    switch (normalizedLevel) {
      case 'HIGH':
        return {
          glow: 'glow-rose',
          border: 'border-rose-500/40',
          bgBadge: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
          progressBar: 'from-rose-500 to-amber-500',
          textColor: 'text-rose-400',
          icon: ShieldAlert,
          description: 'High loss exposure detected. Actuarial surcharge and manual underwriting review mandated.',
        };
      case 'MEDIUM':
        return {
          glow: 'glow-amber',
          border: 'border-amber-500/40',
          bgBadge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          progressBar: 'from-amber-500 to-yellow-400',
          textColor: 'text-amber-400',
          icon: AlertTriangle,
          description: 'Moderate risk metrics. Qualifies for standard underwriting tiers with deductible optimization.',
        };
      case 'LOW':
      default:
        return {
          glow: 'glow-emerald',
          border: 'border-emerald-500/40',
          bgBadge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          progressBar: 'from-emerald-500 to-teal-400',
          textColor: 'text-emerald-400',
          icon: CheckCircle2,
          description: 'Preferred risk rating. Demonstrates optimal loss history and demographic stability.',
        };
    }
  };

  const theme = getTheme();
  const Icon = theme.icon;

  // Percentage for the meter
  const clampedScore = Math.min(Math.max(riskScore, 0), 100);

  return (
    <div className={`glass-panel rounded-2xl p-6 border ${theme.border} ${theme.glow} transition-all duration-300 relative overflow-hidden`}>
      {/* Background glow tint */}
      <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none ${
        normalizedLevel === 'HIGH' ? 'bg-rose-500' : normalizedLevel === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'
      }`} />

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            Actuarial Risk Assessment
          </span>
        </div>

        {/* Risk Level Badge */}
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${theme.bgBadge}`}>
          <Icon className="w-3.5 h-3.5" />
          <span>Risk Level: {normalizedLevel}</span>
        </div>
      </div>

      {/* Score Presentation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
        <div className="flex items-baseline gap-2">
          <span className={`text-6xl font-extrabold tracking-tight ${theme.textColor}`}>
            {clampedScore}
          </span>
          <span className="text-xl font-medium text-slate-400">/ 100</span>
        </div>

        <div className="flex-1 w-full max-w-xs space-y-2">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Aggregated Risk Gauge</span>
            <span className="font-mono font-medium text-slate-200">{clampedScore}% Exposure</span>
          </div>

          {/* Meter Bar */}
          <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${theme.progressBar} transition-all duration-1000 ease-out`}
              style={{ width: `${clampedScore}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0 (Low)</span>
            <span>50 (Moderate)</span>
            <span>100 (Critical)</span>
          </div>
        </div>
      </div>

      {/* Underwriting Descriptor */}
      <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-300 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">{theme.description}</p>
      </div>
    </div>
  );
}
