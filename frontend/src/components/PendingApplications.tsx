import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronRight, BrainCircuit, X, AlertCircle, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { WorkflowTimeline, DocumentChecklist, getProjectCategory, getProjectStage } from './ClearanceControls';

interface Project {
  id: number;
  title: string;
  applicant: string;
  status: string;
  riskScore: number;
  riskSummary: string;
  createdAt: string;
  description: string;
}

export default function PendingApplications() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [deficiencyMsg, setDeficiencyMsg] = useState('');
  const [isRaisingDeficiency, setIsRaisingDeficiency] = useState(false);
  const { token } = useAuth();

  const fetchData = () => {
    fetch(`${API_BASE_URL}/api/projects`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(setProjects)
      .catch(() => {});
    fetch(`${API_BASE_URL}/api/reports`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(setReports).catch(() => {});
    fetch(`${API_BASE_URL}/api/alerts`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(setAlerts).catch(() => {});
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleRaiseDeficiency = async () => {
    if (!selectedProject || !deficiencyMsg) return;
    setIsRaisingDeficiency(true);
    try {
      await fetch(`${API_BASE_URL}/api/alerts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          projectId: selectedProject.id,
          type: 'Deficiency',
          severity: 'Deficiency',
          message: deficiencyMsg
        })
      });
      setDeficiencyMsg('');
      fetchData();
    } finally {
      setIsRaisingDeficiency(false);
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.applicant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || p.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-white">Pending Applications</h1>
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-950/50">
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Project Name</th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Applicant</th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Risk Score</th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {filteredProjects.map((project) => (
              <tr key={project.id} className="hover:bg-zinc-800/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-medium text-zinc-100">{project.title}</div>
                  <div className="text-xs text-zinc-500">Infrastructure</div>
                </td>
                <td className="px-6 py-4 text-sm text-zinc-400">{project.applicant}</td>
                <td className="px-6 py-4">
                  <div className={`flex items-center gap-1.5 font-bold ${
                    project.riskScore > 70 ? 'text-red-500' : project.riskScore > 30 ? 'text-amber-500' : 'text-emerald-500'
                  }`}>
                    {project.riskScore}/100
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    project.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' :
                    project.status === 'Rejected' ? 'bg-red-500/10 text-red-500' :
                    'bg-amber-500/10 text-amber-500'
                  }`}>
                    {project.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-zinc-500">
                  {new Date(project.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => setSelectedProject(project)}
                    className="p-2 text-zinc-500 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProjects.length === 0 && (
          <div className="p-12 text-center text-zinc-500">No projects found matching your criteria.</div>
        )}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-2xl bg-zinc-950 border-l border-zinc-800 z-[101] shadow-2xl overflow-y-auto"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-white">Project Details</h2>
                  <button onClick={() => setSelectedProject(null)} className="p-2 hover:bg-zinc-900 rounded-full text-zinc-500">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-8">
                  <section>
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Overview</h3>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
                      <div>
                        <div className="text-xs text-zinc-500 mb-1">Project Title</div>
                        <div className="text-lg font-semibold text-white">{selectedProject.title}</div>
                      </div>
                      <div>
                        <div className="text-xs text-zinc-500 mb-1">Description</div>
                        <p className="text-zinc-400 text-sm leading-relaxed">{selectedProject.description}</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">AI Risk Assessment</h3>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-indigo-500/10 rounded-xl">
                            <BrainCircuit className="text-indigo-400" size={24} />
                          </div>
                          <div>
                            <div className="text-xs text-zinc-500">Risk Score</div>
                            <div className={`text-2xl font-bold ${
                              selectedProject.riskScore > 70 ? 'text-red-500' : selectedProject.riskScore > 30 ? 'text-amber-500' : 'text-emerald-500'
                            }`}>{selectedProject.riskScore}/100</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-zinc-500 mb-1">Confidence</div>
                          <div className="text-sm font-bold text-emerald-500">94%</div>
                        </div>
                      </div>
                      <div className="bg-zinc-950 border border-zinc-800/50 rounded-xl p-4">
                        <p className="text-sm text-zinc-400 leading-relaxed italic">"{selectedProject.riskSummary}"</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Application Workflow</h3>
                    <WorkflowTimeline stage={getProjectStage(selectedProject, alerts)} />
                  </section>

                  <section>
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Document Checklist</h3>
                    <DocumentChecklist 
                      category={getProjectCategory(selectedProject.description)} 
                      projectFiles={reports.filter((r: any) => r.projectId === selectedProject.id)} 
                    />
                  </section>

                  <section>
                    <h3 className="text-sm font-bold text-red-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <AlertCircle size={14} /> Raise New Deficiency
                    </h3>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
                      <textarea
                        value={deficiencyMsg}
                        onChange={e => setDeficiencyMsg(e.target.value)}
                        placeholder="Describe the missing document or required correction..."
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-red-500/50 resize-none"
                        rows={3}
                      />
                      <button 
                        onClick={handleRaiseDeficiency}
                        disabled={isRaisingDeficiency || !deficiencyMsg}
                        className="w-full py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus size={14} /> {isRaisingDeficiency ? 'Sending...' : 'Raise Deficiency'}
                      </button>
                    </div>
                  </section>

                  {alerts.filter(a => a.projectId === selectedProject.id && a.severity === 'Deficiency').length > 0 && (
                    <section>
                      <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Past Deficiencies</h3>
                      <div className="space-y-3">
                        {alerts.filter(a => a.projectId === selectedProject.id && a.severity === 'Deficiency').map((a, i) => (
                          <div key={i} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                            <p className="text-sm text-zinc-300">{a.message}</p>
                            <p className="text-[10px] text-zinc-500 mt-2">{new Date(a.createdAt).toLocaleDateString()}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  <div className="pt-8 flex gap-4">
                    <button 
                      onClick={async () => {
                        const res = await fetch(`${API_BASE_URL}/api/projects/${selectedProject.id}/status`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                          body: JSON.stringify({ status: 'Approved' })
                        });
                        if (res.ok) {
                          setProjects(prev => prev.map(p => p.id === selectedProject.id ? { ...p, status: 'Approved' } : p));
                          setSelectedProject(null);
                        }
                      }}
                      className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/20"
                    >
                      Approve Project
                    </button>
                    <button 
                      onClick={async () => {
                        const res = await fetch(`${API_BASE_URL}/api/projects/${selectedProject.id}/status`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                          body: JSON.stringify({ status: 'Rejected' })
                        });
                        if (res.ok) {
                          setProjects(prev => prev.map(p => p.id === selectedProject.id ? { ...p, status: 'Rejected' } : p));
                          setSelectedProject(null);
                        }
                      }}
                      className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-900/20"
                    >
                      Reject Project
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
