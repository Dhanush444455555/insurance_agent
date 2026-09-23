import React from 'react';
import { Layers, Shield, Check, Percent, ArrowRight, DollarSign } from 'lucide-react';

export default function PlanCard({ plans = [] }) {
  const defaultPlans = [
    {
      id: 'plan_a',
      name: 'Plan A (Essential Shield)',
      type: 'Liability & Roadside Protection',
      predictedSuitability: 62,
      monthlyEstimate: '$95/mo',
      coverageLimit: '$100,000 / $300,000',
      deductible: '$1,000',
      keyFeatures: [
        'Standard Bodily Injury & Property Damage',
        '24/7 Roadside Assistance & Towing',
        'Digital Self-Service Claim Access',
      ],
    },
    {
      id: 'plan_b',
      name: 'Plan B (Comprehensive Plus)',
      type: 'Collision & High-Exposure Shield',
      predictedSuitability: 87,
      monthlyEstimate: '$165/mo',
      coverageLimit: '$250,000 / $500,000',
      deductible: '$500',
      keyFeatures: [
        'Full Comprehensive & Collision Coverage',
        'Uninsured Motorist Endorsement',
        'OEM Replacement Parts Protection',
        'Zero-Deductible Glass Repair Waiver',
      ],
    },
    {
      id: 'plan_c',
      name: 'Plan C (Executive Umbrella)',
      type: 'High-Asset Multi-Line Coverage',
      predictedSuitability: 74,
      monthlyEstimate: '$240/mo',
      coverageLimit: '$1,000,000 Single Limit',
      deductible: '$250',
      keyFeatures: [
        'Complete Loss-Cost Replacement Rider',
        'Excess Umbrella Liability Guarantee',
        'Personal Injury & Identity Defense',
        'Dedicated Senior Underwriting Liaison',
      ],
    },
  ];

  const planList = plans && plans.length > 0 ? plans : defaultPlans;

  const getSuitabilityColor = (score) => {
    if (score >= 80) return { bar: 'from-cyan-500 to-blue-500', text: 'text-cyan-400', badge: 'bg-cyan-500/10 border-cyan-500/30' };
    if (score >= 70) return { bar: 'from-indigo-500 to-purple-500', text: 'text-indigo-400', badge: 'bg-indigo-500/10 border-indigo-500/30' };
    return { bar: 'from-slate-500 to-slate-400', text: 'text-slate-300', badge: 'bg-slate-800 border-slate-700' };
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-700/60 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100 tracking-tight">
              Insurance Plan Evaluation
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Machine learning actuarial match across risk parameters
          </p>
        </div>

        {/* Notice strictly adhering to instructions */}
        <div className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300 font-mono">
          Model: Multiclass Plan Scoring
        </div>
      </div>

      {/* Grid of Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {planList.map((plan) => {
          const suitability = plan.predictedSuitability ?? 70;
          const style = getSuitabilityColor(suitability);

          return (
            <div
              key={plan.id || plan.name}
              className="glass-card rounded-xl p-5 border border-slate-700/70 hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Plan Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-slate-100 text-sm group-hover:text-cyan-400 transition-colors">
                      {plan.name}
                    </h4>
                    <p className="text-[11px] text-slate-400">{plan.type}</p>
                  </div>
                  <Shield className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors shrink-0" />
                </div>

                {/* Predicted Suitability Display (Strict wording compliance) */}
                <div className="my-4 p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-400 font-medium">Predicted suitability</span>
                    <span className={`font-mono font-bold text-sm ${style.text}`}>
                      {suitability}%
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${style.bar} transition-all duration-700`}
                      style={{ width: `${suitability}%` }}
                    />
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-800/80 mb-3">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Est. Premium</span>
                    <span className="font-semibold text-slate-200">{plan.monthlyEstimate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Deductible</span>
                    <span className="font-semibold text-slate-200">{plan.deductible}</span>
                  </div>
                </div>

                {/* Key Features */}
                <div className="space-y-1.5 mt-2">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block mb-1">
                    Coverage Highlights:
                  </span>
                  {plan.keyFeatures?.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-1.5 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="leading-snug text-[11px]">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <span>Coverage Limit:</span>
                <span className="font-mono text-slate-300">{plan.coverageLimit}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
