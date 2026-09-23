import React, { useState, useEffect } from 'react';
import { Cpu, Database, Sparkles, Layers, ShieldCheck, CheckCircle2 } from 'lucide-react';

const STEPS = [
  {
    icon: ShieldCheck,
    title: 'Ingesting Actuarial Metrics',
    description: 'Evaluating loss history, claims exposure, and vehicle risk factors...',
  },
  {
    icon: Database,
    title: 'Querying Underwriting Guidelines (RAG)',
    description: 'Retrieving top matching clauses from ChromaDB vector store...',
  },
  {
    icon: Layers,
    title: 'Running ML Plan Suitability Scoring',
    description: 'Predicting multiclass plan affinity distribution across profiles...',
  },
  {
    icon: Sparkles,
    title: 'Generating Executive AI Summary',
    description: 'LangGraph LLM orchestrator synthesizing final underwriter brief...',
  },
];

export default function LoadingState() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel rounded-2xl p-8 border border-cyan-500/30 glow-blue text-center relative overflow-hidden">
      {/* Background radial pulses */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />

      {/* Main Spinner & Title */}
      <div className="flex flex-col items-center justify-center mb-8 relative z-10">
        <div className="relative mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-cyan-500/30 animate-pulse">
            <Cpu className="w-8 h-8 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500"></span>
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-100 tracking-tight">
          AI Risk Pipeline Processing
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">
          Simultaneously running actuarial heuristics, RAG vector retrieval, and ML suitability models
        </p>
      </div>

      {/* Stepped progress indicators */}
      <div className="max-w-md mx-auto space-y-3 relative z-10 text-left">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < activeStep;
          const isCurrent = idx === activeStep;

          return (
            <div
              key={step.title}
              className={`flex items-center gap-3.5 p-3 rounded-xl border transition-all duration-300 ${
                isCurrent
                  ? 'bg-cyan-950/40 border-cyan-500/40 text-slate-100 shadow-md shadow-cyan-500/10'
                  : isDone
                  ? 'bg-slate-900/60 border-slate-800 text-slate-300'
                  : 'bg-slate-900/20 border-slate-900 text-slate-600'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs transition-colors ${
                  isDone
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : isCurrent
                    ? 'bg-cyan-500/20 text-cyan-400 animate-pulse'
                    : 'bg-slate-800 text-slate-600'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">{step.title}</span>
                  {isCurrent && (
                    <span className="text-[10px] font-mono text-cyan-400 animate-pulse">
                      In progress...
                    </span>
                  )}
                  {isDone && (
                    <span className="text-[10px] font-mono text-emerald-400">
                      Done
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
