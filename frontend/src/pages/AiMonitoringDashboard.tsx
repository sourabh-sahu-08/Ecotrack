import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Satellite, Activity, Wind, Droplets, AlertTriangle, ShieldCheck, Map as MapIcon, Radio, MapPin, Zap, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AiMonitoringDashboard() {
  const [data, setData] = useState<any>(null);
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<'iot' | 'satellite' | 'compliance'>('iot');

  useEffect(() => {
    fetch('/api/monitoring/data', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(r => r.json())
    .then(d => setData(d))
    .catch(e => console.error(e));

    // Simulated real-time polling
    const interval = setInterval(() => {
      fetch('/api/monitoring/data', { headers: { 'Authorization': `Bearer ${token}` } })
        .then(r => r.json())
        .then(d => setData(d));
    }, 15000);

    return () => clearInterval(interval);
  }, [token]);

  if (!data) {
    return (
      <div className="p-10 flex flex-col items-center justify-center h-[60vh]">
        <div className="relative mb-6">
          <Satellite size={48} className="text-emerald-500 animate-pulse" />
          <Radio size={24} className="text-emerald-300 absolute -top-2 -right-2 animate-ping" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Connecting to Sentinel Network...</h2>
        <p className="text-zinc-500">Establishing secure uplink to IoT and GIS sensors.</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6 fade-up">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/10 rounded-xl relative">
              <Activity className="text-emerald-400" size={24} />
              <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
            </div>
            <h1 className="text-3xl font-bold text-white">AI Monitoring Center</h1>
          </div>
          <p className="text-zinc-400">Real-time IoT telemetry, satellite defoliation tracking, and automated compliance.</p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-3">
            <Radio className="text-blue-400" size={20} />
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Active Sensors</div>
              <div className="font-bold text-white leading-tight">{data.activeSensors} Nodes</div>
            </div>
          </div>
          <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
            <AlertTriangle className="text-red-400" size={20} />
            <div>
              <div className="text-[10px] text-red-500/70 uppercase tracking-widest font-bold">Critical Alerts</div>
              <div className="font-bold text-red-400 leading-tight">{data.alerts.length} Detected</div>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-x-auto no-scrollbar max-w-fit">
        {[
          { id: 'iot', label: 'IoT Pollution Matrix', icon: Wind },
          { id: 'satellite', label: 'Satellite GIS Analytics', icon: Satellite },
          { id: 'compliance', label: 'Compliance Tracking', icon: ShieldCheck }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === t.id 
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-900/20' 
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 border border-transparent'
            }`}
          >
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* IOT TAB */}
          {activeTab === 'iot' && (
            <div className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Air Quality */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Wind className="text-blue-400" size={20} /> Air Quality Feed
                  </h3>
                  <div className="space-y-3">
                    {data.airQuality.map((node: any, i: number) => (
                      <div key={i} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-zinc-200">{node.sensorId}</p>
                          <p className="text-xs text-zinc-500">{node.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">AQI</p>
                          <p className={`text-xl font-bold ${node.aqi > 100 ? 'text-amber-400' : 'text-emerald-400'}`}>{node.aqi}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Water Quality */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Droplets className="text-blue-400" size={20} /> Water Quality Feed
                  </h3>
                  <div className="space-y-3">
                    {data.waterQuality.map((node: any, i: number) => (
                      <div key={i} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-sm font-semibold text-zinc-200">{node.sensorId}</p>
                            <p className="text-xs text-zinc-500">{node.location}</p>
                          </div>
                          <span className={`px-2 py-1 text-[10px] uppercase font-bold rounded bg-zinc-900 border ${
                            node.status === 'Normal' ? 'border-emerald-500/30 text-emerald-400' : 'border-amber-500/30 text-amber-400'
                          }`}>{node.status}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                           <div className="bg-zinc-900 rounded p-2 text-center">
                             <div className="text-[10px] text-zinc-500">pH Level</div>
                             <div className="text-sm font-bold text-zinc-300">{node.pH}</div>
                           </div>
                           <div className="bg-zinc-900 rounded p-2 text-center">
                             <div className="text-[10px] text-zinc-500">Turbidity</div>
                             <div className="text-sm font-bold text-zinc-300">{node.turbidity} NTU</div>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Alerts Stream */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                 <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="text-red-400" size={20} /> Automated Pollution Alerts
                  </h3>
                  <div className="space-y-2">
                    {data.alerts.map((alert: any, i: number) => (
                      <div key={i} className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl flex items-center gap-4">
                        <div className="p-2 bg-red-500/10 rounded-lg shrink-0">
                           <AlertTriangle size={18} className="text-red-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-red-500 uppercase tracking-widest">{alert.type} • PRIORITY 1</span>
                            <span className="text-[10px] text-zinc-500 px-2 py-0.5 bg-zinc-950 rounded border border-white/5">{alert.timestamp}</span>
                          </div>
                          <p className="text-sm text-zinc-300 font-medium">{alert.message}</p>
                        </div>
                        <button className="px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-xs text-zinc-300 transition-colors">
                          Acknowledge
                        </button>
                      </div>
                    ))}
                    {data.alerts.length === 0 && (
                      <div className="p-8 text-center text-zinc-500 bg-zinc-950 border border-zinc-800/50 rounded-xl">
                        No critical pollution alerts in the network.
                      </div>
                    )}
                  </div>
              </div>
            </div>
          )}

          {/* SATELLITE TAB */}
          {activeTab === 'satellite' && (
            <div className="grid lg:grid-cols-3 gap-6">
               <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-[500px] flex flex-col relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4 z-10 relative">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <MapIcon className="text-indigo-400" size={20} /> Orbital Imaging Feed
                    </h3>
                    <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded text-xs text-indigo-400 font-bold uppercase tracking-widest">
                       <Zap size={14} className="animate-pulse" /> Live Analysis
                    </div>
                  </div>
                  <div className="flex-1 bg-zinc-950 rounded-xl border border-zinc-800 relative group overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-70 group-hover:scale-105 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
                    
                    {/* Simulated change markers */}
                    {data.satelliteChanges.map((change: any, i: number) => (
                      <div key={i} className="absolute" style={{ top: `${20 + (i * 30)}%`, left: `${30 + (i * 20)}%` }}>
                         <div className="w-4 h-4 rounded-full bg-red-500/50 border border-red-400 flex items-center justify-center cursor-pointer group/marker">
                           <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-ping" />
                           <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-2 bg-zinc-900 border border-zinc-700 rounded shadow-xl opacity-0 group-hover/marker:opacity-100 transition-opacity z-20 pointer-events-none">
                              <p className="text-xs font-bold text-white">{change.project}</p>
                              <p className="text-[10px] text-zinc-400 mt-1">{change.issue}</p>
                           </div>
                         </div>
                      </div>
                    ))}
                    
                    <div className="absolute bottom-4 left-4 right-4 p-3 bg-zinc-900/80 backdrop-blur border border-zinc-700/50 rounded-lg flex items-center justify-between">
                       <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-medium tracking-widest">Sentinel-2 Sync: Active</span>
                       <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold flex items-center gap-1"><CheckCircle size={10} /> Calibrated</span>
                    </div>
                  </div>
               </div>
               
               <div className="lg:col-span-1 space-y-6">
                 <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Detected Anomalies</h3>
                    <div className="space-y-3">
                      {data.satelliteChanges.map((change: any, i: number) => (
                        <div key={i} className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-indigo-500/30 transition-colors cursor-pointer">
                           <div className="flex items-start justify-between mb-1">
                             <h4 className="text-sm font-bold text-zinc-200">{change.project}</h4>
                             <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider bg-red-500/10 px-1.5 py-0.5 rounded">{change.changePercentage} Diff</span>
                           </div>
                           <p className="text-xs text-zinc-500">{change.issue}</p>
                           <div className="mt-2 text-[10px] text-zinc-600 flex items-center gap-1"><MapPin size={10}/> Detected {new Date().toLocaleDateString()}</div>
                        </div>
                      ))}
                    </div>
                 </div>
               </div>
            </div>
          )}

          {/* COMPLIANCE TAB */}
          {activeTab === 'compliance' && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="text-emerald-400" size={20} /> Continuous Compliance Tracker
                </h3>
                <button className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium rounded-lg transition-colors">
                  Export Audit Log
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-zinc-800 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                      <th className="px-4 py-3">Project Name</th>
                      <th className="px-4 py-3">Conditions Met</th>
                      <th className="px-4 py-3">Latest Check</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {[
                      { name: 'Solar Park Alpha', cond: '24/24', date: 'Today, 08:30 AM', status: 'Compliant', color: 'text-emerald-400 bg-emerald-500/10' },
                      { name: 'Riverfront Development', cond: '18/20', date: 'Yesterday, 14:15 PM', status: 'Warning', color: 'text-amber-400 bg-amber-500/10' },
                      { name: 'Highway Exp. Phase 2', cond: '4/12', date: 'Today, 10:00 AM', status: 'Violation', color: 'text-red-400 bg-red-500/10' },
                      { name: 'Green Valley Wind', cond: '15/15', date: '3 days ago', status: 'Compliant', color: 'text-emerald-400 bg-emerald-500/10' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="px-4 py-4 text-sm font-medium text-white">{row.name}</td>
                        <td className="px-4 py-4 text-sm text-zinc-400">{row.cond}</td>
                        <td className="px-4 py-4 text-sm text-zinc-500">{row.date}</td>
                        <td className="px-4 py-4">
                          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded ${row.color}`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
