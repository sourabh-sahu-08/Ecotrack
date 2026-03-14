import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, ShieldAlert, Zap, MapPin, ExternalLink, Bell, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Alert {
  id: number;
  projectId: number;
  projectTitle: string;
  type: string;
  severity: string;
  message: string;
  createdAt: string;
}

export default function RiskAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    fetch('/api/alerts', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setAlerts(data));
  }, [token]);

  const getSeverityStyles = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'bg-red-500/10 border-red-500/30 text-red-500';
      case 'medium': return 'bg-amber-500/10 border-amber-500/30 text-amber-500';
      default: return 'bg-blue-500/10 border-blue-500/30 text-blue-500';
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Real-time Risk Alerts</h1>
          <p className="text-zinc-400">Automated monitoring system flagging ecological violations.</p>
        </div>
        <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl relative">
          <Bell className="text-zinc-400" size={24} />
          <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-zinc-900"></span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {alerts.length > 0 ? alerts.map((item, i) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            key={item.id} 
            className={`p-6 rounded-2xl border flex flex-col md:flex-row md:items-center gap-6 transition-all hover:scale-[1.01] ${getSeverityStyles(item.severity)}`}
          >
            <div className="p-4 bg-white/5 rounded-2xl">
              {item.severity === 'High' ? <ShieldAlert size={32} /> : <AlertTriangle size={32} />}
            </div>
            
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-white/10 rounded">
                  {item.type}
                </span>
                <span className="text-xs opacity-60 flex items-center gap-1">
                  <Clock size={12} /> {new Date(item.createdAt).toLocaleString()}
                </span>
              </div>
              <h3 className="text-lg font-bold">{item.projectTitle}</h3>
              <p className="text-sm opacity-80 leading-relaxed">{item.message}</p>
            </div>
 
            <div className="flex gap-3">
              <button 
                onClick={() => alert(`Center map on project: ${item.projectTitle} (${item.projectId})`)}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
              >
                <MapPin size={20} />
              </button>
              <button 
                onClick={() => alert(`Starting deep investigation for: ${item.projectTitle}\nTriggering satellite imagery analysis...`)}
                className="px-4 py-2 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all flex items-center gap-2 text-sm"
              >
                Investigate <ExternalLink size={16} />
              </button>
            </div>
          </motion.div>
        )) : (
          <div className="p-20 text-center bg-zinc-900 border border-zinc-800 rounded-3xl">
            <Zap size={48} className="mx-auto text-zinc-700 mb-4" />
            <h3 className="text-lg font-bold text-zinc-400">No active alerts</h3>
            <p className="text-zinc-600 mt-1">Satellite monitoring shows no immediate risks.</p>
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <div className="text-xs text-zinc-500 uppercase font-bold mb-2">Critical Zones</div>
          <div className="text-3xl font-bold text-white">12</div>
          <div className="mt-2 text-xs text-red-500 font-medium">+2 since yesterday</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <div className="text-xs text-zinc-500 uppercase font-bold mb-2">Compliance Rate</div>
          <div className="text-3xl font-bold text-white">94.2%</div>
          <div className="mt-2 text-xs text-emerald-500 font-medium">Stable</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <div className="text-xs text-zinc-500 uppercase font-bold mb-2">Avg. Response Time</div>
          <div className="text-3xl font-bold text-white">4.5h</div>
          <div className="mt-2 text-xs text-indigo-500 font-medium">Improving</div>
        </div>
      </div>
    </div>
  );
}
