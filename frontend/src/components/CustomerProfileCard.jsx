import React from 'react';
import { User, DollarSign, Calendar, MapPin, Car, ShieldAlert, ShieldCheck, FileCheck } from 'lucide-react';

export default function CustomerProfileCard({ profile }) {
  if (!profile) return null;

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-700/60 shadow-lg relative overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 font-bold text-sm">
            {profile.name ? profile.name.split(' ').map(n => n[0]).join('') : 'CU'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-100">{profile.name || profile.customerId}</h3>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                {profile.customerId}
              </span>
            </div>
            <p className="text-xs text-slate-400">Actuarial Profile on File</p>
          </div>
        </div>

        {profile.tier && (
          <span className="self-start sm:self-auto text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            {profile.tier}
          </span>
        )}
      </div>

      {/* Grid of Profile Parameters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
        {/* Age */}
        <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>Age</span>
          </div>
          <span className="font-semibold text-slate-100 text-sm">{profile.age} yrs</span>
        </div>

        {/* Income */}
        <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Annual Income</span>
          </div>
          <span className="font-semibold text-slate-100 text-sm">
            ${Number(profile.income).toLocaleString()}
          </span>
        </div>

        {/* Claims History */}
        <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Past Claims</span>
          </div>
          <span className="font-semibold text-slate-100 text-sm">
            {profile.claimsCount} {profile.claimsCount === 1 ? 'Claim' : 'Claims'}
          </span>
        </div>

        {/* Total Claim Amount */}
        <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
            <span>Claim Losses</span>
          </div>
          <span className="font-semibold text-slate-100 text-sm">
            ${Number(profile.totalClaimAmount).toLocaleString()}
          </span>
        </div>

        {/* Location Risk */}
        <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>Location Hazard</span>
          </div>
          <span className={`font-semibold text-xs px-2 py-0.5 rounded-full inline-block mt-0.5 ${
            profile.locationRisk === 'High'
              ? 'bg-rose-500/20 text-rose-300'
              : profile.locationRisk === 'Medium'
              ? 'bg-amber-500/20 text-amber-300'
              : 'bg-emerald-500/20 text-emerald-300'
          }`}>
            {profile.locationRisk}
          </span>
        </div>

        {/* Vehicle Risk */}
        <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
            <Car className="w-3.5 h-3.5 text-indigo-400" />
            <span>Vehicle Class</span>
          </div>
          <span className={`font-semibold text-xs px-2 py-0.5 rounded-full inline-block mt-0.5 ${
            profile.vehicleRisk === 'High'
              ? 'bg-rose-500/20 text-rose-300'
              : profile.vehicleRisk === 'Medium'
              ? 'bg-amber-500/20 text-amber-300'
              : 'bg-emerald-500/20 text-emerald-300'
          }`}>
            {profile.vehicleRisk}
          </span>
        </div>

        {/* Required Coverage */}
        <div className="col-span-2 p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Requested Coverage Tier</span>
            </div>
            <span className="font-semibold text-slate-100 text-xs">
              {profile.requiredCoverage}
            </span>
          </div>
          <FileCheck className="w-5 h-5 text-cyan-400/80 mr-2" />
        </div>
      </div>
    </div>
  );
}
