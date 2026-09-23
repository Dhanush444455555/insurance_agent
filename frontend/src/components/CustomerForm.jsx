import React, { useState } from 'react';
import { Search, User, Sparkles, RefreshCw, ChevronDown, ChevronUp, Sliders, ShieldCheck } from 'lucide-react';
import { SYNTHETIC_CUSTOMERS, getCustomerById } from '../services/api';

export default function CustomerForm({ onSubmit, isLoading, onCustomerIdChange, initialCustomerId = 'CUST-1001' }) {
  const [customerId, setCustomerId] = useState(initialCustomerId);
  const [showOverrides, setShowOverrides] = useState(false);
  const [profileOverride, setProfileOverride] = useState(null);

  // Quick preset IDs
  const quickProfiles = Object.values(SYNTHETIC_CUSTOMERS);

  const handleSelectId = (id) => {
    setCustomerId(id);
    const resolved = getCustomerById(id);
    setProfileOverride(resolved);
    if (onCustomerIdChange) onCustomerIdChange(resolved);
    onSubmit(resolved);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setCustomerId(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const resolved = profileOverride && profileOverride.customerId === customerId
      ? profileOverride
      : getCustomerById(customerId);
    
    if (onCustomerIdChange) onCustomerIdChange(resolved);
    onSubmit(resolved);
  };

  const handleOverrideField = (field, value) => {
    const current = profileOverride || getCustomerById(customerId);
    const updated = { ...current, [field]: value };
    setProfileOverride(updated);
    if (onCustomerIdChange) onCustomerIdChange(updated);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-xl border border-slate-700/60 relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-100 tracking-tight">Customer Lookup</h2>
            <p className="text-xs text-slate-400">Enter Customer ID to retrieve profile & risk</p>
          </div>
        </div>

        <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-full bg-slate-800 text-cyan-400 border border-slate-700">
          ID Intake
        </span>
      </div>

      {/* Main Single-Input Form: Customer ID */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center justify-between">
            <span>Customer ID</span>
            <span className="text-[10px] text-slate-400 font-normal">e.g. CUST-1001, CUST-1002</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cyan-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={customerId}
              onChange={handleInputChange}
              required
              placeholder="Enter Customer ID..."
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-mono font-semibold"
            />
          </div>
        </div>

        {/* Quick Select Preset Pills */}
        <div>
          <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Available Pre-Loaded Customer IDs:
          </span>
          <div className="grid grid-cols-2 gap-2">
            {quickProfiles.map((p) => {
              const isSelected = customerId.toUpperCase() === p.customerId;
              return (
                <button
                  key={p.customerId}
                  type="button"
                  onClick={() => handleSelectId(p.customerId)}
                  className={`text-left p-2 rounded-xl border text-xs transition-all ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-500/60 text-white shadow-sm'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="font-mono font-bold text-xs text-cyan-400 flex items-center justify-between">
                    <span>{p.customerId}</span>
                    <span className="text-[9px] font-sans font-normal text-slate-400">{p.age}y</span>
                  </div>
                  <div className="text-[11px] text-slate-300 truncate font-medium">{p.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{p.tier}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Primary CTA Button: ANALYZE RISK */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !customerId.trim()}
            className="w-full py-3.5 px-4 rounded-xl font-bold tracking-wide text-sm bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 transform active:scale-[0.99]"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>FETCHING & ANALYZING...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>ANALYZE RISK</span>
              </>
            )}
          </button>
        </div>

        {/* Collapsible Underwriting Adjustments Toggle (Optional for judges/testing) */}
        <div className="pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => setShowOverrides(!showOverrides)}
            className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 py-1 transition-colors"
          >
            <span className="flex items-center gap-1.5 font-medium">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              Advanced Parameter Overrides
            </span>
            {showOverrides ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showOverrides && (
            <div className="mt-3 space-y-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Age</label>
                  <input
                    type="number"
                    value={(profileOverride || getCustomerById(customerId)).age}
                    onChange={(e) => handleOverrideField('age', Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Income ($)</label>
                  <input
                    type="number"
                    value={(profileOverride || getCustomerById(customerId)).income}
                    onChange={(e) => handleOverrideField('income', Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Claims Count</label>
                  <input
                    type="number"
                    value={(profileOverride || getCustomerById(customerId)).claimsCount}
                    onChange={(e) => handleOverrideField('claimsCount', Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Claim Loss ($)</label>
                  <input
                    type="number"
                    value={(profileOverride || getCustomerById(customerId)).totalClaimAmount}
                    onChange={(e) => handleOverrideField('totalClaimAmount', Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Location Risk</label>
                  <select
                    value={(profileOverride || getCustomerById(customerId)).locationRisk}
                    onChange={(e) => handleOverrideField('locationRisk', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Vehicle Risk</label>
                  <select
                    value={(profileOverride || getCustomerById(customerId)).vehicleRisk}
                    onChange={(e) => handleOverrideField('vehicleRisk', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
