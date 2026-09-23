import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, Activity, AlertCircle, RefreshCw, CheckCircle, ExternalLink, Cpu, MessageSquare } from 'lucide-react';
import CustomerForm from '../components/CustomerForm';
import RiskCard from '../components/RiskCard';
import RiskFactors from '../components/RiskFactors';
import PlanCard from '../components/PlanCard';
import AIReport from '../components/AIReport';
import LoadingState from '../components/LoadingState';
import AIChatBot from '../components/AIChatBot';
import { analyzeRisk } from '../services/api';

export default function Dashboard() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastSubmissionTime, setLastSubmissionTime] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Initial demonstration load
  useEffect(() => {
    handleAnalyze({
      customerId: 'CUST-94021',
      age: 32,
      income: 85000,
      claimsCount: 2,
      totalClaimAmount: 12500,
      locationRisk: 'High',
      vehicleRisk: 'Medium',
      requiredCoverage: 'Comprehensive',
    });
  }, []);

  const handleAnalyze = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await analyzeRisk(formData);
      setResult(data);
      setLastSubmissionTime(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Unable to complete risk analysis. Please check network connectivity.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 pb-16">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  InsureAI RiskLens
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                  v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                AI Underwriting Intelligence & Risk Profile Summarizer
              </p>
            </div>
          </div>

          {/* System Status & Top-Right AI Chatbot Spark Button */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">Pipeline:</span>
              <span className="font-mono text-cyan-300 text-[11px]">FastAPI + LangGraph + RAG</span>
            </div>

            {/* Top Right Chrome Gemini-Style Chatbot Button */}
            <button
              onClick={() => setIsChatOpen(true)}
              className="relative group flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/10 via-indigo-500/15 to-purple-500/20 hover:from-cyan-500/20 hover:via-indigo-500/25 hover:to-purple-500/30 border border-cyan-500/30 hover:border-cyan-400/60 text-slate-100 shadow-md shadow-cyan-500/10 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <div className="text-left">
                <span className="block text-xs font-bold bg-gradient-to-r from-cyan-300 to-indigo-200 bg-clip-text text-transparent">
                  Ask AI Copilot
                </span>
              </div>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Subheader Banner */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Underwriting Risk Dashboard
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Real-time actuarial loss profiling, policy guidelines retrieval (RAG), and multiclass plan prediction.
            </p>
          </div>

          {lastSubmissionTime && (
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span>Last evaluated: {lastSubmissionTime}</span>
            </div>
          )}
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Customer Intake Form (4 cols on lg) */}
          <div className="lg:col-span-4 sticky top-24">
            <CustomerForm onSubmit={handleAnalyze} isLoading={isLoading} />
          </div>

          {/* Right Column: AI Analysis & Risk Results (8 cols on lg) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Error Banner */}
            {error && (
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{error}</span>
                </div>
                <button
                  onClick={() => handleAnalyze()}
                  className="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Loading State */}
            {isLoading && <LoadingState />}

            {/* Results Content */}
            {!isLoading && result && (
              <div className="space-y-6">
                {/* Upper Results: Risk Score Card & Contributing Risk Factors */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                  <div className="md:col-span-6">
                    <RiskCard
                      riskScore={result.riskScore}
                      riskLevel={result.riskLevel}
                    />
                  </div>
                  <div className="md:col-span-6">
                    <RiskFactors factors={result.riskFactors} />
                  </div>
                </div>

                {/* Plan Suitability Evaluation (Strictly: Predicted suitability) */}
                <PlanCard plans={result.plans} />

                {/* AI Executive Summary & Retrieved Guidelines (RAG) */}
                <AIReport
                  aiSummary={result.aiSummary}
                  retrievedGuidelines={result.retrievedGuidelines}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Bottom-Right Quick Chat Launcher */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-30 p-3.5 rounded-full bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 text-white shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-110 active:scale-95 transition-all flex items-center justify-center border border-white/20"
          title="Open InsureAI Copilot"
        >
          <Sparkles className="w-5 h-5 animate-spin-slow" />
        </button>
      )}

      {/* Side-Panel Gemini-Style AI Chatbot Drawer */}
      <AIChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
