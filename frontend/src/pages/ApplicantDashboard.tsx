import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText, CheckCircle, AlertCircle, Clock, Search, Calendar, XCircle, Send, Upload, ChevronRight, BarChart2, Shield, Download, Bell, BellDot, Leaf, Compass, Zap, Focus, Info, Layout, Activity, Menu, X
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../context/AuthContext';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { PROJECT_CATEGORIES } from '../constants/checklists';
import { WorkflowTimeline, DocumentChecklist, getProjectCategory, getProjectStage } from '../components/ClearanceControls';

function ApplicantHome() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, news: 0 });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/projects`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        const mine = data.filter((p: any) => p.applicant === user?.organization || p.applicant === user?.name);
        setStats({
          total: mine.length,
          approved: mine.filter((p: any) => p.status === 'Approved').length,
          pending: mine.filter((p: any) => p.status === 'Pending').length,
          news: 2 // Mock
        });
      }).catch(() => {});
  }, [token, user]);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
      <header className="relative py-12 px-8 rounded-3xl bg-zinc-900 overflow-hidden group border border-zinc-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px] -mr-48 -mt-48 group-hover:bg-emerald-500/20 transition-colors duration-700" />
        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-4">Welcome Back, {user?.role}</span>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
              Hello, <span className="text-emerald-500">{user?.name || 'Applicant'}</span>
            </h1>
            <p className="text-zinc-400 max-w-xl text-lg leading-relaxed">
              Your environmental clearance dashboard is ready. You have <span className="text-white font-bold">{stats.pending}</span> applications awaiting review.
            </p>
          </motion.div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Projects', val: stats.total, icon: Layout, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          { label: 'Approved', val: stats.approved, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Pending Review', val: stats.pending, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Risk Alerts', val: stats.news, icon: Activity, color: 'text-red-400', bg: 'bg-red-500/10' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="group bg-zinc-900 border border-zinc-800 p-6 rounded-3xl hover:border-zinc-700 transition-all">
            <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center ${s.color} mb-4 group-hover:scale-110 transition-transform`}>
              <s.icon size={24} />
            </div>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">{s.label}</p>
            <p className="text-3xl font-black text-white">{s.val}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                 <Focus size={18} className="text-emerald-500" /> Recent Activity
              </h2>
           </div>
           <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center">
              <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                 <Shield size={32} className="text-zinc-600" />
              </div>
              <p className="text-zinc-500">No recent activity detected in the last 24 hours.</p>
           </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Bell size={18} className="text-emerald-500" /> Quick Actions
          </h2>
          <div className="space-y-3">
             <Link to="/applicant/submit" className="flex items-center justify-between p-5 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-white transition-all group">
                <span className="font-bold">Submit New Project</span>
                <Send size={18} className="group-hover:translate-x-1 transition-transform" />
             </Link>
             <Link to="/applicant/projects" className="flex items-center justify-between p-5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl text-white transition-all group">
                <span className="font-bold">Track Applications</span>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform text-zinc-600" />
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── My Applications ─────────────────────────────────────────────────────────
function MyApplications() {
  const [projects, setProjects] = useState<any[]>([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const { token, user } = useAuth();

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/projects`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        const mine = data.filter((p: any) =>
          p.applicant === user?.organization || p.applicant === user?.name
        );
        setProjects(mine);
      }).catch(() => {});
    
    fetch(`${API_BASE_URL}/api/reports`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(setReports).catch(() => {});
    fetch(`${API_BASE_URL}/api/alerts`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(setAlerts).catch(() => {});
  }, [token, user]);

  const statuses = ['All', 'Pending', 'Under Review', 'Approved', 'Rejected'];
  const filtered = projects.filter(p =>
    (filter === 'All' || p.status === filter) &&
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (s: string) =>
    s === 'Approved' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
    s === 'Rejected' ? 'text-red-400 bg-red-500/10 border-red-500/20' :
    s === 'Under Review' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' :
    'text-amber-400 bg-amber-500/10 border-amber-500/20';

  const StatusIcon = ({ s }: { s: string }) =>
    s === 'Approved' ? <CheckCircle size={14} /> :
    s === 'Rejected' ? <XCircle size={14} /> :
    s === 'Under Review' ? <Search size={14} /> :
    <Clock size={14} />;

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-white mb-1">My Applications</h1>
        <p className="text-zinc-400 text-sm">Track the status of your environmental clearance submissions.</p>
      </header>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search applications..."
            className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                filter === s
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-600'
              }`}
            >{s}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', val: projects.length, color: 'text-white' },
          { label: 'Pending', val: projects.filter(p => p.status === 'Pending').length, color: 'text-amber-400' },
          { label: 'Approved', val: projects.filter(p => p.status === 'Approved').length, color: 'text-emerald-400' },
          { label: 'Rejected', val: projects.filter(p => p.status === 'Rejected').length, color: 'text-red-400' },
        ].map(({ label, val, color }) => (
          <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${color}`}>{val}</p>
            <p className="text-xs text-zinc-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
              <FileText size={32} className="mx-auto text-zinc-700 mb-3" />
              <p className="text-zinc-500">No applications found.</p>
            </div>
          ) : filtered.map((app, i) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`bg-zinc-900 border rounded-2xl overflow-hidden transition-all ${
                expandedId === app.id ? 'border-emerald-500/50 ring-1 ring-emerald-500/20' : 'border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div 
                onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                className="p-5 flex items-start justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className={`p-3 rounded-xl shrink-0 transition-colors ${expandedId === app.id ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-400'}`}>
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-zinc-100 truncate">{app.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      <span className="text-xs text-zinc-500 flex items-center gap-1">
                        <Calendar size={11} /> {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 bg-zinc-800 text-zinc-500 rounded font-bold uppercase tracking-wider">
                        {getProjectCategory(app.description)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:block text-right">
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Stage</div>
                    <div className="text-xs font-medium text-zinc-300">{getProjectStage(app, alerts)}</div>
                  </div>
                  <span className={`shrink-0 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border ${statusColor(app.status)}`}>
                    <StatusIcon s={app.status} />
                    {app.status}
                  </span>
                </div>
              </div>

              {expandedId === app.id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }}
                  className="px-5 pb-6 border-t border-zinc-800 bg-zinc-950/30"
                >
                  <WorkflowTimeline stage={getProjectStage(app, alerts)} />
                  
                  <div className="mt-8 space-y-6">
                    <DocumentChecklist 
                      category={getProjectCategory(app.description)} 
                      projectFiles={reports.filter((r: any) => r.projectId === app.id)} 
                    />

                    {alerts.filter(a => a.projectId === app.id && a.severity === 'Deficiency').length > 0 && (
                      <div className="pt-4 border-t border-zinc-800">
                        <h3 className="text-sm font-bold text-red-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <AlertCircle size={14} /> Deficiencies Raised
                        </h3>
                        <div className="space-y-3">
                          {alerts.filter(a => a.projectId === app.id && a.severity === 'Deficiency').map((a, i) => (
                            <div key={i} className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl flex items-start justify-between gap-4">
                              <div>
                                <p className="text-sm text-zinc-200 font-medium">{a.message}</p>
                                <p className="text-[10px] text-zinc-500 mt-1">Raised on {new Date(a.createdAt).toLocaleDateString()}</p>
                              </div>
                              <button className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300 rounded-lg hover:bg-zinc-800">Resolve</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Submit Project ───────────────────────────────────────────────────────────
function SubmitProject() {
  const [form, setForm] = useState({ title: '', description: '', lat: '', lng: '', type: 'Infrastructure', category: PROJECT_CATEGORIES[0], area: '', forestLand: 'No', waterUsage: '', cost: '', employment: '', distProtectedArea: '', emissions: 'None', wastewater: '', solidWaste: '' });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const { token, user } = useAuth();

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadProgress(0);

    const tick = setInterval(() => setUploadProgress(p => Math.min(p + 15, 90)), 150);

    try {
      const res = await fetch(`${API_BASE_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ 
          ...form, 
          description: `[Category: ${form.category}] ${form.description}`,
          applicant: user?.organization || user?.name, 
          lat: parseFloat(form.lat) || 20.5, 
          lng: parseFloat(form.lng) || 78.9 
        }),
      });
      if (res.ok) { setUploadProgress(100); setTimeout(() => setSubmitted(true), 400); }
    } finally {
      clearInterval(tick);
      setIsUploading(false);
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(0);
    const tick = setInterval(() => setUploadProgress(p => Math.min(p + 20, 90)), 200);
    try {
      const res = await fetch(`${API_BASE_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: file.name.replace('.pdf', '') + ' Project',
          description: `EIA document: ${file.name}`,
          applicant: user?.organization || user?.name,
          lat: 20 + Math.random() * 10,
          lng: 70 + Math.random() * 15,
        }),
      });
      if (res.ok) { setUploadProgress(100); setTimeout(() => setSubmitted(true), 400); }
    } finally {
      clearInterval(tick);
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false } as any);

  if (submitted) return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-zinc-900 border border-emerald-500/20 rounded-2xl p-12 text-center">
        <CheckCircle size={48} className="mx-auto text-emerald-400 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Project Submitted!</h2>
        <p className="text-zinc-400 mb-6 text-sm">Your project has been received and queued for AI risk analysis and regulator review.</p>
        <button onClick={() => { setSubmitted(false); setForm({ title: '', description: '', lat: '', lng: '', type: 'Infrastructure', category: PROJECT_CATEGORIES[0], area: '', forestLand: 'No', waterUsage: '', cost: '', employment: '', distProtectedArea: '', emissions: 'None', wastewater: '', solidWaste: '' }); }}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-colors">
          Submit Another
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-white mb-1">Submit Project</h1>
        <p className="text-zinc-400 text-sm">Submit a new environmental clearance application for AI-powered risk assessment.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
            <Send size={16} className="text-emerald-400" /> Fill Project Details
          </h2>
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Project Title *</label>
              <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Solar Park Alpha" className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Description *</label>
              <textarea required value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={4} placeholder="Describe the project scope, area, and environmental considerations..."
                className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Project Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value, type: e.target.value.includes('Projects') ? 'Infrastructure' : 'Mining' }))}
                  className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50">
                  {PROJECT_CATEGORIES.map(cat => <option key={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Req. Forest Land</label>
                <select value={form.forestLand} onChange={e => setForm(f => ({ ...f, forestLand: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50">
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Area (Hectares)</label>
                <input type="number" required value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))}
                  placeholder="e.g. 50" className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Est. Project Cost (Cr)</label>
                <input type="number" required value={form.cost} onChange={e => setForm(f => ({ ...f, cost: e.target.value }))}
                  placeholder="e.g. 100" className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Water Usage (L/Day)</label>
                <input type="number" required value={form.waterUsage} onChange={e => setForm(f => ({ ...f, waterUsage: e.target.value }))}
                  placeholder="e.g. 10000" className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Wastewater (L/Day)</label>
                <input type="number" value={form.wastewater} onChange={e => setForm(f => ({ ...f, wastewater: e.target.value }))}
                  placeholder="e.g. 5000" className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Solid Waste (Tons/Day)</label>
                <input type="number" value={form.solidWaste} onChange={e => setForm(f => ({ ...f, solidWaste: e.target.value }))}
                  placeholder="e.g. 2" className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Expected Air Emissions</label>
                <select value={form.emissions} onChange={e => setForm(f => ({ ...f, emissions: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50">
                  <option>None / Negligible</option>
                  <option>Dust / Particulates (PM10/PM2.5)</option>
                  <option>Chemical Gases (SOx/NOx)</option>
                  <option>Heavy Smoke / Odor</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Est. Employment</label>
                <input type="number" required value={form.employment} onChange={e => setForm(f => ({ ...f, employment: e.target.value }))}
                  placeholder="e.g. 200" className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Dist. to Protected Area (km)</label>
                <input type="number" required value={form.distProtectedArea} onChange={e => setForm(f => ({ ...f, distProtectedArea: e.target.value }))}
                  placeholder="e.g. 15" className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Latitude</label>
                <input value={form.lat} onChange={e => setForm(f => ({ ...f, lat: e.target.value }))}
                  placeholder="e.g. 19.07" className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Longitude</label>
                <input value={form.lng} onChange={e => setForm(f => ({ ...f, lng: e.target.value }))}
                  placeholder="e.g. 72.87" className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50" />
              </div>
            </div>

            {isUploading && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Processing & AI analyzing...</span>
                  <span className="text-emerald-400">{uploadProgress}%</span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-emerald-500 rounded-full" animate={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            <button type="submit" disabled={isUploading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
              <Send size={16} /> {isUploading ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col">
          <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
            <Upload size={16} className="text-emerald-400" /> Upload EIA PDF
          </h2>
          <div {...getRootProps()} className={`flex-1 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-emerald-500 bg-emerald-500/5' : 'border-zinc-700 hover:border-zinc-500'
          }`}>
            <input {...getInputProps()} />
            <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center mb-4">
              <Upload size={24} className="text-zinc-400" />
            </div>
            <p className="text-sm font-medium text-zinc-200 mb-1">{isDragActive ? 'Drop it here!' : 'Drag & drop your EIA PDF'}</p>
            <p className="text-xs text-zinc-500">or click to browse · PDF only</p>
          </div>
          <div className="mt-4 p-3 bg-zinc-950 rounded-xl flex items-start gap-2 text-xs text-zinc-500">
            <Info size={14} className="text-zinc-600 shrink-0 mt-0.5" />
            <span>Your document will be parsed and key environmental data points will be auto-extracted using AI.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Compliance Reports ───────────────────────────────────────────────────────
function ComplianceReports() {
  const [projects, setProjects] = useState<any[]>([]);
  const { token, user } = useAuth();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/projects`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        const mine = data.filter((p: any) =>
          p.applicant === user?.organization || p.applicant === user?.name
        );
        setProjects(mine);
      }).catch(() => {});
  }, [token, user]);

  const riskColor = (score: number) =>
    score >= 70 ? 'text-red-400 bg-red-500/10 border-red-500/20' :
    score >= 40 ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
    'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';

  const riskLabel = (score: number) =>
    score >= 70 ? 'High Risk' : score >= 40 ? 'Medium Risk' : 'Low Risk';

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-white mb-1">Compliance Reports</h1>
        <p className="text-zinc-400 text-sm">AI-generated environmental risk assessments for your submitted projects.</p>
      </header>

      {projects.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
          <Shield size={32} className="mx-auto text-zinc-700 mb-3" />
          <p className="text-zinc-500">No compliance reports yet. Submit a project to generate one.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-semibold text-zinc-100 text-lg">{p.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-zinc-500 flex items-center gap-1">
                      <Calendar size={11} /> {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-zinc-500">{p.applicant}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-medium px-3 py-1.5 rounded-lg border flex items-center gap-1.5 ${riskColor(p.riskScore ?? 0)}`}>
                    <BarChart2 size={12} /> {riskLabel(p.riskScore ?? 0)} ({p.riskScore ?? 'N/A'}/100)
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
                  <span>Risk Score</span><span>{p.riskScore ?? 0}/100</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${(p.riskScore ?? 0) >= 70 ? 'bg-red-500' : (p.riskScore ?? 0) >= 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${p.riskScore ?? 0}%` }}
                    transition={{ delay: i * 0.05 + 0.2, duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {p.riskSummary && (
                <p className="text-sm text-zinc-400 bg-zinc-950 rounded-xl p-4 border border-zinc-800">{p.riskSummary}</p>
              )}

              <div className="mt-4 flex items-center justify-between">
                <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                  p.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' :
                  p.status === 'Rejected' ? 'bg-red-500/10 text-red-400' :
                  'bg-amber-500/10 text-amber-400'
                }`}>{p.status}</span>
                <button
                  onClick={() => {
                    const report = [
                      `EcoTrack Compliance Report`,
                      `========================`,
                      `Project: ${p.title}`,
                      `Applicant: ${p.applicant}`,
                      `Status: ${p.status}`,
                      `Risk Score: ${p.riskScore ?? 'N/A'}/100 (${riskLabel(p.riskScore ?? 0)})`,
                      `Date: ${new Date(p.createdAt).toLocaleDateString()}`,
                      ``,
                      `AI Risk Summary:`,
                      p.riskSummary || 'Not available.',
                      ``,
                      `Generated by EcoTrack AI on ${new Date().toLocaleString()}`,
                    ].join('\n');
                    const blob = new Blob([report], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${p.title.replace(/\s+/g, '_')}_compliance_report.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-emerald-400 transition-colors"
                >
                  <Download size={13} /> Download Report
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Notifications ────────────────────────────────────────────────────────────
function Notifications() {
  const { user } = useAuth();

  const now = new Date();
  const fmt = (minsAgo: number) => {
    const d = new Date(now.getTime() - minsAgo * 60000);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + d.toLocaleDateString();
  };

  const notifications = [
    { id: 1, type: 'info', icon: CheckCircle, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', title: 'Application Approved', message: 'Solar Park Alpha has been approved by the regulator.', time: fmt(15), read: false },
    { id: 2, type: 'warning', icon: AlertCircle, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', title: 'Document Revision Required', message: 'Riverfront Development needs additional hydrology data before review can proceed.', time: fmt(120), read: false },
    { id: 3, type: 'info', icon: Search, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', title: 'Under Review', message: 'Green Valley Wind Farm has entered the regulator review stage.', time: fmt(300), read: true },
    { id: 4, type: 'success', icon: Leaf, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', title: 'AI Analysis Complete', message: 'Risk score generated for your latest submission. Score: 35/100 (Low Risk).', time: fmt(480), read: true },
    { id: 5, type: 'info', icon: Bell, color: 'text-zinc-400 bg-zinc-800 border-zinc-700', title: 'Welcome to EcoTrack', message: `Hello ${user?.name || 'Applicant'}! Your account is active. Get started by submitting your first project.`, time: fmt(1440), read: true },
  ];

  const [items, setItems] = useState(notifications);
  const unread = items.filter(n => !n.read).length;

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto space-y-6">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Notifications</h1>
          <p className="text-zinc-400 text-sm">Stay updated on your application status and system alerts.</p>
        </div>
        {unread > 0 && (
          <button onClick={() => setItems(i => i.map(n => ({ ...n, read: true })))}
            className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors mt-1 whitespace-nowrap">
            Mark all read
          </button>
        )}
      </header>

      {unread > 0 && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-sm text-emerald-300">
          <BellDot size={16} />
          You have <strong>{unread}</strong> unread notification{unread > 1 ? 's' : ''}
        </div>
      )}

      <div className="space-y-3">
        {items.map((n, i) => {
          const Icon = n.icon as any;
          return (
            <motion.div key={n.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => setItems(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
              className={`bg-zinc-900 border rounded-2xl p-5 flex items-start gap-4 cursor-pointer transition-all duration-200 hover:border-zinc-700 ${!n.read ? 'border-zinc-700 ring-1 ring-zinc-700/50' : 'border-zinc-800 opacity-70'}`}>
              <div className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${n.color}`}>
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-semibold ${n.read ? 'text-zinc-400' : 'text-zinc-100'}`}>{n.title}</p>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-1.5" />}
                </div>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{n.message}</p>
                <p className="text-xs text-zinc-600 mt-2 flex items-center gap-1">
                  <Clock size={10} /> {n.time}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function ApplicantDashboard() {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Use sub-components as pages
  return (
    <div className="min-h-screen bg-black text-zinc-400 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-zinc-800/50 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
            <Leaf size={18} />
          </div>
          <span className="font-black text-white tracking-widest uppercase italic text-sm">EcoTrack</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-zinc-400">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`fixed top-0 left-0 z-40 w-72 h-screen transition-transform border-r border-zinc-800/50 bg-black/80 backdrop-blur-xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-10 px-2 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
              <Leaf size={22} />
            </div>
            <div>
              <span className="text-lg font-black text-white tracking-widest uppercase italic">EcoTrack</span>
              <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter -mt-1">Regulator-AI System</div>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {[
              { label: 'Overview', icon: Focus, path: '/applicant' },
              { label: 'Track Applications', icon: Compass, path: '/applicant/projects' },
              { label: 'Submit New EIA', icon: Send, path: '/applicant/submit' },
              { label: 'Risk Analysis', icon: BarChart2, path: '/applicant/reports' },
              { label: 'Notifications', icon: Bell, path: '/applicant/notifications' },
            ].map((item) => (
              <Routes key={item.path}>
                <Route path="*" element={
                  <Navigate to={item.path} />
                }/>
              </Routes>
            ))}
            
            <Link to="/applicant" className="nav-link flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:bg-zinc-900/50 transition-all group">
               <Focus size={18} className="group-hover:text-emerald-400" /> <span className="text-sm font-medium">Overview</span>
            </Link>
            <Link to="/applicant/projects" className="nav-link flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:bg-zinc-900/50 transition-all group">
               <Compass size={18} className="group-hover:text-emerald-400" /> <span className="text-sm font-medium">My Applications</span>
            </Link>
            <Link to="/applicant/submit" className="nav-link flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:bg-zinc-900/50 transition-all group">
               <Send size={18} className="group-hover:text-emerald-400" /> <span className="text-sm font-medium">Submit Project</span>
            </Link>
            <Link to="/applicant/reports" className="nav-link flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:bg-zinc-900/50 transition-all group">
               <BarChart2 size={18} className="group-hover:text-emerald-400" /> <span className="text-sm font-medium">Risk Reports</span>
            </Link>
            <Link to="/applicant/notifications" className="nav-link flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:bg-zinc-900/50 transition-all group">
               <Bell size={18} className="group-hover:text-emerald-400" /> <span className="text-sm font-medium">Notifications</span>
            </Link>
          </nav>

          <div className="mt-auto pt-6 border-t border-zinc-800/50">
            <div className="flex items-center gap-3 px-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 font-bold uppercase">
                {user?.name?.[0] || 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">{user?.name || 'Applicant'}</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest truncate">{user?.role || 'Applicant'}</p>
              </div>
            </div>
            <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-medium text-sm">
              <Zap size={18} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Hero Content Area */}
      <main className="lg:ml-72 min-h-screen relative p-4">
        <Routes>
          <Route path="/" element={<ApplicantHome />} />
          <Route path="/projects" element={<MyApplications />} />
          <Route path="/submit" element={<SubmitProject />} />
          <Route path="/reports" element={<ComplianceReports />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="*" element={<Navigate to="/applicant" replace />} />
        </Routes>
      </main>
    </div>
  );
}

