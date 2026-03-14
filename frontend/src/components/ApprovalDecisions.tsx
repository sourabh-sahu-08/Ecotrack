import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, Info, MessageSquare, History, BrainCircuit, AlertTriangle, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Project {
  id: number;
  title: string;
  applicant: string;
  status: string;
  riskScore: number;
  riskSummary: string;
  description: string;
}

interface Decision {
  id: number;
  status: string;
  comment: string;
  createdAt: string;
}

export default function ApprovalDecisions() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    fetch('/api/projects', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        const pending = data.filter((p: Project) => p.status === 'Pending' || p.status === 'Under Review');
        setProjects(pending);
        if (pending.length > 0) setSelectedProject(pending[0]);
      });
  }, [token]);

  useEffect(() => {
    if (selectedProject) {
      fetch(`/api/projects/${selectedProject.id}/decisions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setDecisions(data));
    }
  }, [selectedProject, token]);

  const handleDecision = async (status: string) => {
    if (!selectedProject || !comment) {
      alert("Please provide a comment for your decision.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${selectedProject.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, comment })
      });

      if (res.ok) {
        setProjects(projects.filter(p => p.id !== selectedProject.id));
        setSelectedProject(projects.find(p => p.id !== selectedProject.id) || null);
        setComment('');
      }
    } catch (error) {
      console.error('Decision failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (projects.length === 0) {
    return (
      <div className="p-10 text-center">
        <CheckCircle2 size={64} className="mx-auto text-emerald-500 mb-4 opacity-20" />
        <h2 className="text-xl font-bold text-zinc-300">No Pending Decisions</h2>
        <p className="text-zinc-500 mt-2">All environmental clearance applications have been processed.</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left: Project List */}
      <div className="lg:col-span-1 space-y-4">
        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Awaiting Decision</h2>
        <div className="space-y-3">
          {projects.map((project) => (
            <div 
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedProject?.id === project.id 
                  ? 'bg-emerald-500/10 border-emerald-500/50' 
                  : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="font-semibold text-zinc-100 mb-1">{project.title}</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">{project.applicant}</span>
                <span className={`text-[10px] font-bold ${
                  project.riskScore > 70 ? 'text-red-500' : project.riskScore > 30 ? 'text-amber-500' : 'text-emerald-500'
                }`}>Risk: {project.riskScore}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Decision Panel */}
      <div className="lg:col-span-2 space-y-6">
        {selectedProject && (
          <motion.div 
            key={selectedProject.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Project Summary Card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">{selectedProject.title}</h1>
                  <p className="text-zinc-400 text-sm">{selectedProject.applicant} • Infrastructure Project</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-zinc-500 mb-1">AI Risk Score</div>
                  <div className={`text-3xl font-black ${
                    selectedProject.riskScore > 70 ? 'text-red-500' : selectedProject.riskScore > 30 ? 'text-amber-500' : 'text-emerald-500'
                  }`}>{selectedProject.riskScore}/100</div>
                </div>
              </div>

              <div className="bg-zinc-950 border border-zinc-800/50 rounded-2xl p-5 mb-6">
                <div className="flex items-start gap-3">
                  <BrainCircuit className="text-indigo-400 mt-1" size={20} />
                  <div>
                    <h4 className="text-sm font-bold text-zinc-200 mb-1">AI Risk Explanation</h4>
                    <p className="text-sm text-zinc-400 leading-relaxed italic">"{selectedProject.riskSummary}"</p>
                  </div>
                </div>
              </div>

              {/* AI Recommendation */}
              <div className={`border rounded-2xl p-5 mb-8 ${
                selectedProject.riskScore > 70 ? 'bg-red-500/10 border-red-500/30' : 
                selectedProject.riskScore > 30 ? 'bg-amber-500/10 border-amber-500/30' : 
                'bg-emerald-500/10 border-emerald-500/30'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <BrainCircuit size={18} className={
                    selectedProject.riskScore > 70 ? 'text-red-400' : 
                    selectedProject.riskScore > 30 ? 'text-amber-400' : 
                    'text-emerald-400'
                  } />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">AI Approval Prediction System</h4>
                </div>
                <p className="text-sm text-zinc-300">
                  Based on the comprehensive risk analysis ({selectedProject.riskScore}/100) and regulatory guidelines, the AI suggests: <strong className={`font-bold ${
                    selectedProject.riskScore > 70 ? 'text-red-400' : 
                    selectedProject.riskScore > 30 ? 'text-amber-400' : 
                    'text-emerald-400'
                  }`}>{
                    selectedProject.riskScore > 70 ? 'Reject Project (High Risk)' : 
                    selectedProject.riskScore > 30 ? 'Request More Info / Modify (Medium Risk)' : 
                    'Approve Project (Low Risk)'
                  }</strong>
                </p>
              </div>

              {/* Decision Form */}
              <div className="space-y-4">
                <label className="block text-sm font-bold text-zinc-400 uppercase tracking-wider ml-1">Decision Reasoning (Mandatory)</label>
                <textarea 
                  className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-white focus:outline-none focus:border-emerald-500 transition-all"
                  placeholder="Explain the technical grounds for approval or rejection..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                
                <div className="flex flex-wrap gap-4 pt-2">
                  <button 
                    disabled={loading}
                    onClick={() => handleDecision('Approved')}
                    className="flex-1 min-w-[140px] py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
                  >
                    <CheckCircle2 size={20} /> Approve
                  </button>
                  <button 
                    disabled={loading}
                    onClick={() => handleDecision('Rejected')}
                    className="flex-1 min-w-[140px] py-4 bg-red-600/10 hover:bg-red-600/20 border border-red-500/30 text-red-500 font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle size={20} /> Reject
                  </button>
                  <button 
                    disabled={loading}
                    onClick={() => handleDecision('Under Review')}
                    className="flex-1 min-w-[140px] py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
                  >
                    <Info size={20} /> Request Info
                  </button>
                </div>
              </div>
            </div>

            {/* Timeline / History */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <History size={20} className="text-zinc-500" /> Review Timeline
              </h3>
              <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-zinc-800">
                {decisions.length > 0 ? decisions.map((d, i) => (
                  <div key={i} className="relative pl-8">
                    <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-zinc-900 flex items-center justify-center ${
                      d.status === 'Approved' ? 'bg-emerald-500' : d.status === 'Rejected' ? 'bg-red-500' : 'bg-amber-500'
                    }`}></div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-zinc-200">{d.status}</span>
                      <span className="text-xs text-zinc-500">{new Date(d.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed">{d.comment}</p>
                  </div>
                )) : (
                  <div className="text-sm text-zinc-500 italic pl-8">No previous actions recorded for this project.</div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
