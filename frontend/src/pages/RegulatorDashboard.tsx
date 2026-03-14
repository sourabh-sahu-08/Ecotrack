import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';
import { motion } from 'motion/react';
import { AlertTriangle, CheckCircle2, Clock, FileSearch, ShieldAlert, BrainCircuit, PieChart, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import RegulatorMap from '../components/RegulatorMap';
import PendingApplications from '../components/PendingApplications';
import ReviewDocuments from '../components/ReviewDocuments';
import ApprovalDecisions from '../components/ApprovalDecisions';
import RiskAlerts from '../components/RiskAlerts';
import ImpactAnalytics from '../components/ImpactAnalytics';
import AiMonitoringDashboard from './AiMonitoringDashboard';

interface Project {
  id: number;
  title: string;
  applicant: string;
  status: string;
  riskScore: number;
  riskSummary: string;
  createdAt: string;
  lat: number;
  lng: number;
  description: string;
}

function RegulatorHome() {
  const [projects, setProjects] = useState<Project[]>([]);

  const { token } = useAuth();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/projects`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setProjects(data));
  }, [token]);

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await fetch(`${API_BASE_URL}/api/projects/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      setProjects(projects.map(p => p.id === id ? { ...p, status } : p));
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const pendingProjects = projects.filter(p => p.status === 'Pending' || p.status === 'Under Review');
  const approvedCount = projects.filter(p => p.status === 'Approved').length;
  const rejectedCount = projects.filter(p => p.status === 'Rejected').length;
  const highRiskCount = projects.filter(p => p.riskScore > 70).length;
  console.log('Stats:', { approvedCount, rejectedCount, highRiskCount });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Regulator Dashboard</h1>
          <p className="text-zinc-400">Review AI-flagged risks and manage pending clearances.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl flex items-center gap-3">
            <Clock className="text-amber-500" size={20} />
            <div>
              <div className="text-xs text-zinc-500">SLA Breaches</div>
              <div className="font-bold text-white">2 Pending</div>
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl flex items-center gap-3">
            <ShieldAlert className="text-red-500" size={20} />
            <div>
              <div className="text-xs text-zinc-500">High Risk</div>
              <div className="font-bold text-white">4 Projects</div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Applications', val: projects.length, icon: FileSearch, color: 'text-white' },
          { label: 'Approved', val: approvedCount, icon: CheckCircle2, color: 'text-emerald-400' },
          { label: 'Pending Review', val: pendingProjects.length, icon: Clock, color: 'text-amber-400' },
          { label: 'High Risk', val: highRiskCount, icon: AlertTriangle, color: 'text-red-400' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-zinc-950 border border-zinc-800 ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{stat.val}</div>
              <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Analytics Section */}
        <div className="xl:col-span-1 bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <PieChart size={18} className="text-emerald-400" /> Category Distribution
          </h2>
          <div className="space-y-4">
             {['Mining', 'Infrastructure', 'Energy', 'Manufacturing'].map((cat, i) => {
               const count = projects.filter(p => p.description.includes(cat) || (p as any).type === cat).length;
               const total = projects.length || 1;
               const pct = Math.round((count / total) * 100);
               const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-amber-500', 'bg-indigo-500'];
               return (
                 <div key={cat} className="space-y-1.5">
                   <div className="flex justify-between text-xs font-bold">
                     <span className="text-zinc-400 uppercase tracking-wider">{cat}</span>
                     <span className="text-white">{pct}%</span>
                   </div>
                   <div className="h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/50">
                     <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} className={`h-full ${colors[i % colors.length]}`} />
                   </div>
                 </div>
               );
             })}
          </div>
          <div className="mt-8 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-start gap-3">
            <TrendingUp size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-400 leading-relaxed">
              Applications are up by <span className="text-emerald-400 font-bold">12%</span> compared to last month. Mining projects show the highest increase in risk flags.
            </p>
          </div>
        </div>

        {/* Main Review Queue */}
        <div className="xl:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FileSearch size={20} className="text-emerald-500" />
            Action Required
          </h2>
          
          <div className="space-y-4">
            {pendingProjects.map((project) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={project.id} 
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-zinc-100">{project.title}</h3>
                      <span className="text-xs px-2 py-1 bg-zinc-800 text-zinc-300 rounded-md">{project.applicant}</span>
                    </div>
                    <p className="text-sm text-zinc-400">Submitted on {new Date(project.createdAt).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs text-zinc-500 mb-1">AI Risk Score</div>
                      <div className={`text-xl font-bold flex items-center justify-end gap-1 ${
                        project.riskScore > 70 ? 'text-red-500' : project.riskScore > 30 ? 'text-amber-500' : 'text-emerald-500'
                      }`}>
                        {project.riskScore > 70 && <AlertTriangle size={18} />}
                        {project.riskScore}/100
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800/50 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-indigo-500/10 rounded-md mt-0.5">
                      <BrainCircuit size={16} className="text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-zinc-200 mb-1">AI Risk Summary</h4>
                      <p className="text-sm text-zinc-400 leading-relaxed">{project.riskSummary}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button 
                    onClick={() => handleStatusUpdate(project.id, 'Rejected')}
                    className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(project.id, 'Approved')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                  >
                    Approve Project <CheckCircle2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
            
            {pendingProjects.length === 0 && (
              <div className="text-center py-12 bg-zinc-900 border border-zinc-800 rounded-2xl">
                <CheckCircle2 size={48} className="mx-auto text-emerald-500 mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-zinc-300">All caught up!</h3>
                <p className="text-zinc-500 text-sm mt-1">No pending applications require your review.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* SLA Monitor */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">SLA Monitor</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/20 rounded-xl">
                <div>
                  <div className="text-sm font-medium text-red-200">Riverfront Dev</div>
                  <div className="text-xs text-red-500/70">Overdue by 2 days</div>
                </div>
                <button className="text-xs px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20">Expedite</button>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                <div>
                  <div className="text-sm font-medium text-amber-200">Highway Exp. Phase 2</div>
                  <div className="text-xs text-amber-500/70">Due in 24 hours</div>
                </div>
                <button className="text-xs px-3 py-1.5 bg-amber-500/10 text-amber-400 rounded-lg hover:bg-amber-500/20">Review</button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">This Month</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800/50">
                <div className="text-2xl font-bold text-emerald-400 mb-1">24</div>
                <div className="text-xs text-zinc-500">Approved</div>
              </div>
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800/50">
                <div className="text-2xl font-bold text-red-400 mb-1">{rejectedCount}</div>
                <div className="text-xs text-zinc-500">Rejected</div>
              </div>
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800/50 col-span-2">
                <div className="text-2xl font-bold text-indigo-400 mb-1">12</div>
                <div className="text-xs text-zinc-500">AI Auto-verified Documents</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegulatorDashboard() {
  return (
    <Routes>
      <Route path="/" element={<RegulatorHome />} />
      <Route path="/pending" element={<PendingApplications />} />
      <Route path="/map" element={<RegulatorMap />} />
      <Route path="/review" element={<ReviewDocuments />} />
      <Route path="/decisions" element={<ApprovalDecisions />} />
      <Route path="/alerts" element={<RiskAlerts />} />
      <Route path="/impact" element={<ImpactAnalytics />} />
      <Route path="/monitoring" element={<AiMonitoringDashboard />} />
      <Route path="*" element={<Navigate to="/regulator" replace />} />
    </Routes>
  );
}
