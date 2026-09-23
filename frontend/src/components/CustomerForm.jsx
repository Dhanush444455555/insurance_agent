import React, { useState } from 'react';
import { User, ShieldCheck, DollarSign, AlertTriangle, Car, MapPin, Layers, Sparkles, RefreshCw } from 'lucide-react';

const PRESET_SCENARIOS = [
  {
    label: 'High Risk Profile',
    data: {
      customerId: 'CUST-88319',
      age: 23,
      income: 42000,
      claimsCount: 3,
      totalClaimAmount: 18500,
      locationRisk: 'High',
      vehicleRisk: 'High',
      requiredCoverage: 'Comprehensive',
    },
  },
  {
    label: 'Moderate Risk Profile',
    data: {
      customerId: 'CUST-45120',
      age: 38,
      income: 78000,
      claimsCount: 1,
      totalClaimAmount: 4200,
      locationRisk: 'Medium',
      vehicleRisk: 'Low',
      requiredCoverage: 'Standard',
    },
  },
  {
    label: 'Low Risk Profile',
    data: {
      customerId: 'CUST-10294',
      age: 46,
      income: 135000,
      claimsCount: 0,
      totalClaimAmount: 0,
      locationRisk: 'Low',
      vehicleRisk: 'Low',
      requiredCoverage: 'Basic',
    },
  },
];

export default function CustomerForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    customerId: 'CUST-94021',
    age: 32,
    income: 85000,
    claimsCount: 2,
    totalClaimAmount: 12500,
    locationRisk: 'High',
    vehicleRisk: 'Medium',
    requiredCoverage: 'Comprehensive',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyPreset = (presetData) => {
    setFormData(presetData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-xl border border-slate-700/60 relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-100 tracking-tight">Customer Intake</h2>
            <p className="text-xs text-slate-400">Policy underwriting & actuarial parameters</p>
          </div>
        </div>

        <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-full bg-slate-800/80 text-cyan-400 border border-slate-700">
          Intake Form
        </span>
      </div>

      {/* Quick Demo Scenario Selector */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Quick Demo Presets:
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {PRESET_SCENARIOS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handleApplyPreset(preset.data)}
              className="text-xs py-1.5 px-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-slate-300 hover:text-white transition-all text-center truncate hover:border-cyan-500/50"
            >
              {preset.label.split(' ')[0]} Risk
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Customer ID & Age */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Customer ID
            </label>
            <div className="relative">
              <input
                type="text"
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                required
                placeholder="e.g. CUST-94021"
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Age
            </label>
            <div className="relative">
              <input
                type="number"
                name="age"
                min="18"
                max="100"
                value={formData.age}
                onChange={handleChange}
                required
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Row 2: Annual Income & Total Claim Amount */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Income ($ USD)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 text-xs">
                $
              </span>
              <input
                type="number"
                name="income"
                min="0"
                step="1000"
                value={formData.income}
                onChange={handleChange}
                required
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-7 pr-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Claims Count
            </label>
            <input
              type="number"
              name="claimsCount"
              min="0"
              max="20"
              value={formData.claimsCount}
              onChange={handleChange}
              required
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
            />
          </div>
        </div>

        {/* Row 3: Total Claim Amount */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Total Claim Amount ($ USD)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 text-xs">
              $
            </span>
            <input
              type="number"
              name="totalClaimAmount"
              min="0"
              step="500"
              value={formData.totalClaimAmount}
              onChange={handleChange}
              required
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-7 pr-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
            />
          </div>
        </div>

        {/* Row 4: Location Risk & Vehicle Risk */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              Location Risk
            </label>
            <select
              name="locationRisk"
              value={formData.locationRisk}
              onChange={handleChange}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
            >
              <option value="Low">Low (Suburban / Rural Tier 1)</option>
              <option value="Medium">Medium (Metro Transit Tier 2)</option>
              <option value="High">High (High-Loss Urban Zone IV)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-indigo-400" />
              Vehicle Risk
            </label>
            <select
              name="vehicleRisk"
              value={formData.vehicleRisk}
              onChange={handleChange}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
            >
              <option value="Low">Low (Sedan / EV Safety Rated)</option>
              <option value="Medium">Medium (SUV / Standard Crossover)</option>
              <option value="High">High (Sports / Luxury / High-Theft)</option>
            </select>
          </div>
        </div>

        {/* Row 5: Required Coverage */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Required Coverage Tier
          </label>
          <select
            name="requiredCoverage"
            value={formData.requiredCoverage}
            onChange={handleChange}
            className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
          >
            <option value="Basic">Basic ($100k Liability Minimum)</option>
            <option value="Standard">Standard ($250k Combined Single Limit)</option>
            <option value="Comprehensive">Comprehensive ($500k Full Comprehensive + Collision)</option>
            <option value="Premium">Executive ($1M Umbrella High-Limit Protection)</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl font-bold tracking-wide text-sm bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 transform active:scale-[0.99]"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>ANALYZING RISK PROFILE...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>ANALYZE RISK</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
