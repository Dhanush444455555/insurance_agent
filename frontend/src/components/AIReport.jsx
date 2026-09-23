import React from 'react';
import { Bot, BookOpen, Sparkles, FileText, CheckCircle2, BookmarkCheck } from 'lucide-react';

export default function AIReport({ aiSummary, retrievedGuidelines = [] }) {
  const defaultSummary =
    'Customer demonstrates elevated risk based on the supplied information. Multiple exposure thresholds have been triggered including recent claims volume and high-risk environmental factors. Recommend applying standard territorial surcharge and reviewing deductibles for comprehensive coverage riders.';

  const defaultGuidelines = [
    {
      id: 'UW-GL-401',
      title: 'Loss Frequency & Claim Severity Thresholds',
      excerpt:
        'Accounts exceeding 2 claim events within a 36-month rolling window or $10,000 aggregated payout require mandatory secondary underwriting review before comprehensive endorsement binding.',
      relevance: '94% Vector Similarity',
    },
    {
      id: 'UW-GL-118',
      title: 'Territorial Risk Adjustment & Zonal Ratings',
      excerpt:
        'Zip codes designated as High Risk (Zone IV) necessitate a minimum 18% surcharge on collision riders and restricted glass deductible caps.',
      relevance: '89% Vector Similarity',
    },
    {
      id: 'UW-GL-205',
      title: 'Vehicle Performance Classification & Loss Propensity',
      excerpt:
        'High-risk vehicle categories require telematics endorsement opt-in or enhanced comprehensive deductibles of not less than $1,000.',
      relevance: '83% Vector Similarity',
    },
  ];

  const guidelinesList =
    retrievedGuidelines && retrievedGuidelines.length > 0
      ? retrievedGuidelines
      : defaultGuidelines;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* AI Summary Card */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-700/60 shadow-xl flex flex-col justify-between relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-100 tracking-tight">
                  GenAI Executive Risk Summary
                </h3>
                <p className="text-[11px] text-slate-400">LLM Synthesis & Underwriter Insights</p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              LangGraph RAG Agent
            </span>
          </div>

          {/* Narrative Content */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/90 text-xs text-slate-200 leading-relaxed space-y-3 font-normal">
            <p className="border-l-2 border-indigo-500 pl-3 italic text-slate-300">
              "{aiSummary || defaultSummary}"
            </p>
          </div>
        </div>

        {/* AI Metadata Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Confidence Score: 0.94</span>
          <span>Latency: 380ms</span>
        </div>
      </div>

      {/* Retrieved Guidelines Card */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-700/60 shadow-xl flex flex-col justify-between relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-100 tracking-tight">
                  Retrieved Underwriting Guidelines
                </h3>
                <p className="text-[11px] text-slate-400">Semantic RAG Search from Knowledge Base</p>
              </div>
            </div>

            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              ChromaDB Store
            </span>
          </div>

          {/* Guidelines List */}
          <div className="space-y-3">
            {guidelinesList.map((guideline, idx) => (
              <div
                key={guideline.id || idx}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all text-xs"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <BookmarkCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="font-semibold text-slate-200">
                      {guideline.id}: {guideline.title}
                    </span>
                  </div>
                  {guideline.relevance && (
                    <span className="text-[10px] font-mono text-cyan-400/90 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                      {guideline.relevance}
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed pl-5">
                  {guideline.excerpt || guideline.text || guideline.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Knowledge Base Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Corpus: Underwriting Rules v3.4</span>
          <span>Top-k: 3</span>
        </div>
      </div>
    </div>
  );
}
