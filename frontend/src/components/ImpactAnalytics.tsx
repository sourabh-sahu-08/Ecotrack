import React from 'react';
import { motion } from 'motion/react';
import { BarChart3, Cloud, Droplets, Leaf, Factory, Zap } from 'lucide-react';

export default function ImpactAnalytics() {
  const chartData = [
    { label: 'Energy', value: 75, color: 'bg-indigo-500' },
    { label: 'Mining', value: 45, color: 'bg-amber-500' },
    { label: 'Manufacturing', value: 60, color: 'bg-blue-500' },
    { label: 'Infrastructure', value: 90, color: 'bg-emerald-500' },
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 fade-up">
      <header>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-emerald-500/10 rounded-xl">
            <BarChart3 className="text-emerald-400" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-white">Impact Analytics</h1>
        </div>
        <p className="text-zinc-400">Holistic view of predicted environmental impact across all approved projects.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <Cloud className="text-amber-400" size={20} />
            <h3 className="text-sm font-semibold text-zinc-300">Total Emissions</h3>
          </div>
          <p className="text-3xl font-black text-white">12,450 <span className="text-sm font-medium text-zinc-500">tCO2e/yr</span></p>
          <p className="text-xs text-red-400 mt-2 font-medium">+4.2% from last quarter</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <Droplets className="text-blue-400" size={20} />
            <h3 className="text-sm font-semibold text-zinc-300">Water Usage</h3>
          </div>
          <p className="text-3xl font-black text-white">8.2M <span className="text-sm font-medium text-zinc-500">Liters/yr</span></p>
          <p className="text-xs text-emerald-400 mt-2 font-medium">-1.5% from last quarter</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <Leaf className="text-emerald-400" size={20} />
            <h3 className="text-sm font-semibold text-zinc-300">Forest Cleared</h3>
          </div>
          <p className="text-3xl font-black text-white">450 <span className="text-sm font-medium text-zinc-500">Hectares</span></p>
          <p className="text-xs text-red-400 mt-2 font-medium">+12% from last year</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <Factory className="text-indigo-400" size={20} />
            <h3 className="text-sm font-semibold text-zinc-300">Active Projects</h3>
          </div>
          <p className="text-3xl font-black text-white">142 <span className="text-sm font-medium text-zinc-500">Approved</span></p>
          <p className="text-xs text-emerald-400 mt-2 font-medium">+8% growth rate</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-6">Emissions by Sector</h2>
          <div className="space-y-5">
            {chartData.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-zinc-300 font-medium">{item.label}</span>
                  <span className="text-zinc-500 font-bold">{item.value}k tonnes</span>
                </div>
                <div className="h-3 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={`h-full ${item.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
            <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-4 border-emerald-500/30 flex items-center justify-center mb-6 relative">
               <Zap className="text-emerald-400 drop-shadow-[0_0_10px_#10b981]" size={40} />
               <div className="absolute inset-0 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AI Resource Optimizer Active</h3>
            <p className="text-zinc-400 text-sm max-w-sm mb-6">
              Our Gemini AI model is currently monitoring cumulative regional thresholds across all approved projects to prevent ecological tipping points.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-widest rounded-lg border border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
              Monitoring Active
            </div>
        </div>
      </div>
    </div>
  );
}
