import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload, FileText, CheckCircle, AlertCircle, Clock, ChevronRight,
  Search, Download, Bell, BellDot, Shield, Send,
  Calendar, BarChart2, Leaf, XCircle, Info, Compass, Droplets, Wind, Focus, Zap, Users, Play, Pause, Camera
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../context/AuthContext';
import { Routes, Route, Navigate } from 'react-router-dom';

// ─── My Applications ─────────────────────────────────────────────────────────
function MyApplications() {
  const [projects, setProjects] = useState<any[]>([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const { token, user } = useAuth();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/projects`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        const mine = data.filter((p: any) =>
          p.applicant === user?.organization || p.applicant === user?.name
        );
        setProjects(mine);
      });
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

      {/* Filters */}
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

      {/* Stats row */}
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

      {/* Application cards */}
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
              className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 flex items-start justify-between gap-4 transition-colors"
            >
              <div className="flex items-start gap-4 min-w-0">
                <div className="p-3 bg-zinc-800 rounded-xl shrink-0">
                  <FileText size={20} className="text-zinc-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-zinc-100 truncate">{app.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    <span className="text-xs text-zinc-500 flex items-center gap-1">
                      <Calendar size={11} /> {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                    {app.riskScore !== undefined && (
                      <span className={`text-xs flex items-center gap-1 ${
                        app.riskScore >= 70 ? 'text-red-400' :
                        app.riskScore >= 40 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        <BarChart2 size={11} /> Risk: {app.riskScore}/100
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <span className={`shrink-0 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border ${statusColor(app.status)}`}>
                <StatusIcon s={app.status} />
                {app.status}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Submit Project ───────────────────────────────────────────────────────────
function SubmitProject() {
  const [form, setForm] = useState({ title: '', description: '', lat: '', lng: '', type: 'Infrastructure', area: '', forestLand: 'No', waterUsage: '', cost: '', employment: '', distProtectedArea: '', emissions: 'None', wastewater: '', solidWaste: '' });
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
        body: JSON.stringify({ ...form, applicant: user?.organization || user?.name, lat: parseFloat(form.lat) || 20.5, lng: parseFloat(form.lng) || 78.9 }),
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
        <button onClick={() => { setSubmitted(false); setForm({ title: '', description: '', lat: '', lng: '', type: 'Infrastructure', area: '', forestLand: 'No', waterUsage: '', cost: '', employment: '', distProtectedArea: '', emissions: 'None', wastewater: '', solidWaste: '' }); }}
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
        {/* Manual Form */}
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
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Project Type</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50">
                  <option>Infrastructure</option>
                  <option>Mining</option>
                  <option>Energy</option>
                  <option>Manufacturing</option>
                  <option>Others</option>
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

        {/* PDF Drop */}
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
      });
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

              {/* Risk bar */}
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
          const Icon = n.icon;
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

interface Project {
  id: number;
  title: string;
  status: string;
  createdAt: string;
}

function ApplicantHome() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const { token, user } = useAuth();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/projects`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        // Filter projects for the current applicant
        const myProjects = data.filter((p: any) => p.applicant === user?.organization || p.applicant === user?.name);
        setProjects(myProjects);
      });
  }, [token, user]);

  const onDrop = async (acceptedFiles: File[]) => {
    setIsUploading(true);
    let progress = 0;
    
    // Simulate upload progress
    const interval = setInterval(() => {
      progress += 20;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 200);

    // Simulate file processing and API call
    setTimeout(async () => {
      try {
        const file = acceptedFiles[0];
        const title = file.name.replace('.pdf', '') + ' Project';
        const description = `Environmental Impact Assessment for ${title}. Uploaded document: ${file.name}.`;
        
        // Random coordinates for demo
        const lat = 20 + Math.random() * 10;
        const lng = 70 + Math.random() * 15;

        const res = await fetch(`${API_BASE_URL}/api/projects`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title,
            description,
            applicant: user?.organization || user?.name,
            lat,
            lng
          })
        });

        if (res.ok) {
          // Refresh projects
          const updatedRes = await fetch(`${API_BASE_URL}/api/projects`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await updatedRes.json();
          const myProjects = data.filter((p: any) => p.applicant === user?.organization || p.applicant === user?.name);
          setProjects(myProjects);
        }
      } catch (error) {
        console.error('Failed to submit project:', error);
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    }, 1500);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    multiple: false,
    onDragEnter: () => {},
    onDragOver: () => {},
    onDragLeave: () => {}
  } as any);

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 fade-up">
      {/* Welcome Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs text-zinc-500 uppercase font-medium tracking-widest mb-1">Applicant Workspace</p>
          <h1 className="text-3xl font-bold text-white">
            Hello, <span className="gradient-text">{user?.name?.split(' ')[0] || 'there'}</span> 👋
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Manage your environmental clearance applications.</p>
        </div>
        <div className="flex gap-3">
          {[
            { val: projects.length, label: 'Total', color: 'text-white' },
            { val: projects.filter(p => p.status === 'Approved').length, label: 'Approved', color: 'text-emerald-400' },
            { val: projects.filter(p => p.status === 'Pending').length, label: 'Pending', color: 'text-amber-400' },
          ].map(({ val, label, color }) => (
            <div key={label} className="glass rounded-2xl px-4 py-3 text-center border border-white/6 min-w-[72px]">
              <p className={`text-2xl font-bold ${color}`}>{val}</p>
              <p className="text-[11px] text-zinc-600 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Upload & Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Area */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Upload size={16} className="text-emerald-400" /> Submit New EIA Report
            </h2>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer ${
                isDragActive ? 'border-emerald-500 bg-emerald-500/5 scale-[1.01]' : 'border-zinc-800 hover:border-zinc-600 bg-zinc-950/40'
              }`}
            >
              <input {...getInputProps()} />
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors ${isDragActive ? 'bg-emerald-500/15' : 'bg-zinc-800'}`}>
                <Upload className={isDragActive ? 'text-emerald-400' : 'text-zinc-400'} size={26} />
              </div>
              <p className="text-zinc-200 font-medium mb-1">{isDragActive ? 'Release to upload!' : 'Drag & drop your EIA PDF here'}</p>
              <p className="text-zinc-600 text-sm">or click to browse files</p>
            </div>

            {isUploading && (
              <div className="mt-5 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <div className="w-3 h-3 border border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    Uploading & AI Analyzing...
                  </span>
                  <span className="text-emerald-400 font-semibold">{uploadProgress}%</span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div className="h-full risk-low rounded-full" initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* Active Applications */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <FileText size={16} className="text-zinc-400" /> Active Applications
            </h2>
            <div className="space-y-3">
              {projects.length > 0 ? projects.map((app, i) => (
                <motion.div key={app.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="card-hover flex items-center justify-between p-4 bg-zinc-950/70 rounded-xl border border-zinc-800/50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-zinc-800 shrink-0">
                      <FileText className="text-zinc-400" size={17} />
                    </div>
                    <div>
                      <h3 className="font-medium text-zinc-100 text-sm">{app.title}</h3>
                      <p className="text-xs text-zinc-600 mt-0.5">Submitted {new Date(app.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${
                      app.status === 'Approved' ? 'text-emerald-400 bg-emerald-500/10' :
                      app.status === 'Rejected' ? 'text-red-400 bg-red-500/10' :
                      'text-amber-400 bg-amber-500/10'
                    }`}>{app.status}</span>
                    <ChevronRight size={16} className="text-zinc-700" />
                  </div>
                </motion.div>
              )) : (
                <div className="text-center py-12">
                  <Upload size={28} className="mx-auto text-zinc-700 mb-3" />
                  <p className="text-zinc-500 text-sm">No applications yet. Drop an EIA PDF above to get started.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* AI Document Verifier */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-indigo-500/10 rounded-lg">
                <FileText className="text-indigo-400" size={16} />
              </div>
              <h2 className="text-sm font-semibold text-white">AI Document Verifier</h2>
            </div>
            <div className="space-y-3">
              <div className="p-3.5 bg-emerald-500/5 border border-emerald-500/15 rounded-xl">
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={14} />
                  <div>
                    <h4 className="text-xs font-semibold text-emerald-100">Biodiversity Section Complete</h4>
                    <p className="text-[11px] text-emerald-600 mt-1">All required flora/fauna surveys detected.</p>
                  </div>
                </div>
              </div>
              <div className="p-3.5 bg-amber-500/5 border border-amber-500/15 rounded-xl">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={14} />
                  <div>
                    <h4 className="text-xs font-semibold text-amber-100">Missing Hydrology Data</h4>
                    <p className="text-[11px] text-amber-600 mt-1">Groundwater impact assessment appears incomplete.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-white mb-5">Application Timeline</h2>
            <div className="relative pl-5 border-l-2 border-zinc-800 space-y-5">
              {[
                { label: 'Document Uploaded', time: 'Today, 10:30 AM', done: true },
                { label: 'AI Pre-screening', time: 'Today, 10:35 AM', done: true },
                { label: 'Regulator Review', time: 'Pending', done: false },
              ].map(({ label, time, done }) => (
                <div key={label} className="relative">
                  <div className={`absolute -left-[25px] top-0.5 w-3 h-3 rounded-full ring-4 ring-zinc-950 ${done ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-zinc-700'}`} />
                  <p className={`text-sm font-medium ${done ? 'text-zinc-200' : 'text-zinc-500'}`}>{label}</p>
                  <p className={`text-xs mt-0.5 ${done ? 'text-zinc-500' : 'text-zinc-700'}`}>{time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Permission Advisor ───────────────────────────────────────────────────────────
function PermissionAdvisor() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ approvals?: string[], advice?: string } | null>(null);
  const { token } = useAuth();

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/permission-advisor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ idea })
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6 fade-up">
      <header>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-emerald-500/10 rounded-xl">
            <Compass className="text-emerald-400" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-white">AI Permission Advisor</h1>
        </div>
        <p className="text-zinc-400">Describe your project idea, and our Groq AI will predict the necessary regulatory approvals.</p>
      </header>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Describe your project idea in detail:</label>
            <textarea
              required
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g., We are planning to build a 50-acre solar park near the Aravalli hills, clearing about 5 acres of vegetation..."
              rows={5}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !idea.trim()}
            className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Zap size={18} />}
            {loading ? 'Analyzing Idea...' : 'Predict Required Approvals'}
          </button>
        </form>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="text-emerald-400" size={20} />
                  Predicted Approvals
                </h3>
                <ul className="space-y-3">
                  {result.approvals?.map((approval, idx) => (
                    <li key={idx} className="flex items-start gap-3 bg-zinc-950/50 p-3 rounded-lg border border-white/5">
                      <div className="mt-0.5 p-1 bg-emerald-500/10 rounded-full">
                        <CheckCircle size={14} className="text-emerald-400" />
                      </div>
                      <span className="text-sm text-zinc-300">{approval}</span>
                    </li>
                  ))}
                  {!result.approvals?.length && <p className="text-sm text-zinc-500">No specific approvals matched.</p>}
                </ul>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Info className="text-blue-400" size={20} />
                  AI Rationale
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed bg-zinc-950/50 p-4 rounded-xl border border-white/5">
                  {result.advice}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Impact Simulation ───────────────────────────────────────────────────────────
function ImpactSimulation() {
  const [projectData, setProjectData] = useState({ type: 'manufacturing', area: 10, energy: 500 });
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const { token } = useAuth();
  const [simulationActive, setSimulationActive] = useState(false);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/pollution-predictor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ projectData })
      });
      const data = await res.json();
      setPrediction(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6 fade-up">
      <header>
        <h1 className="text-3xl font-bold text-white mb-2">Environmental Impact Simulation</h1>
        <p className="text-zinc-400">Predict pollution metrics and visualize satellite-based land use change before submission.</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pollution Predictor Form */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Focus className="text-blue-400" size={18} /> Pollution Risk Predictor
          </h2>
          <form onSubmit={handlePredict} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Project Type</label>
                <select
                  value={projectData.type}
                  onChange={e => setProjectData({ ...projectData, type: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50"
                >
                  <option value="manufacturing">Manufacturing Plant</option>
                  <option value="mining">Mining Operation</option>
                  <option value="solar">Solar Farm</option>
                  <option value="infrastructure">Infrastructure/Highway</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Area (Hectares)</label>
                <input
                  type="number"
                  value={projectData.area}
                  onChange={e => setProjectData({ ...projectData, area: Number(e.target.value) })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Est. Energy Usage (MWh/yr)</label>
              <input
                type="number"
                value={projectData.energy}
                onChange={e => setProjectData({ ...projectData, energy: Number(e.target.value) })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-xl transition-all"
            >
              {loading ? 'Running AI Model...' : 'Generate Prediction'}
            </button>
          </form>

          {prediction && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 pt-6 border-t border-zinc-800 grid grid-cols-3 gap-4">
              <div className="bg-zinc-950 border border-white/5 rounded-xl p-4 text-center">
                <Wind className="mx-auto text-amber-400 mb-2" size={20} />
                <div className="text-2xl font-bold text-white">{prediction.air || 0}</div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Air Risk</div>
              </div>
              <div className="bg-zinc-950 border border-white/5 rounded-xl p-4 text-center">
                <Droplets className="mx-auto text-blue-400 mb-2" size={20} />
                <div className="text-2xl font-bold text-white">{prediction.water || 0}</div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Water Risk</div>
              </div>
              <div className="bg-zinc-950 border border-white/5 rounded-xl p-4 text-center">
                <Leaf className="mx-auto text-emerald-400 mb-2" size={20} />
                <div className="text-2xl font-bold text-white">{prediction.co2 || 0}t</div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">CO2/yr</div>
              </div>
              <div className="col-span-3 bg-blue-500/10 p-3 rounded-lg border border-blue-500/20 text-xs text-blue-100 flex gap-2">
                <Info size={14} className="shrink-0 mt-0.5 text-blue-400" />
                <span>{prediction.summary}</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Satellite Visualizer */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Camera className="text-emerald-400" size={18} /> Before vs After Simulation
            </h2>
            <button
              onClick={() => setSimulationActive(!simulationActive)}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
            >
              {simulationActive ? <Pause size={14} /> : <Play size={14} />}
              {simulationActive ? 'Stop' : 'Simulate'}
            </button>
          </div>

          <div className="flex-1 min-h-[300px] relative rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 group">
            {/* Base "Before" Layer */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center" />
            
            {/* Overlay "After" Layer */}
            <motion.div
              className="absolute inset-y-0 left-0 bg-[url('https://images.unsplash.com/photo-1498084393753-b411b2d26f34?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-left"
              initial={{ width: '0%' }}
              animate={{ width: simulationActive ? '100%' : '50%' }}
              transition={{ duration: simulationActive ? 3 : 0.5, ease: 'easeInOut', repeat: simulationActive ? Infinity : 0, repeatType: 'reverse' }}
            >
              {/* Slider Line */}
              <div className="absolute top-0 bottom-0 right-0 w-1 bg-emerald-500 shadow-[0_0_10px_#10b981]" />
            </motion.div>
            
            {/* Labels */}
            <div className="absolute top-4 left-4 px-2 py-1 bg-black/60 backdrop-blur rounded text-[10px] font-bold text-white uppercase tracking-widest">
              Present (Forest)
            </div>
            <div className="absolute top-4 right-4 px-2 py-1 bg-black/60 backdrop-blur rounded text-[10px] font-bold text-white uppercase tracking-widest">
              Predicted (Development)
            </div>
          </div>
          <p className="text-xs text-zinc-500 mt-4 text-center">
            Simulated visual impact based on project coordinates and development area footprint.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Review Meetings ───────────────────────────────────────────────────────────
function ReviewMeetings() {
  const [loading, setLoading] = useState(false);
  const [gist, setGist] = useState<string | null>(null);
  const { token } = useAuth();
  
  const mockTranscript = `Regulator 1: Thank you for joining. Let's discuss the Solar Park Alpha project. The biodiversity section looks good, but I am concerned about the water usage for panel cleaning.
Applicant: We plan to use robotic dry-cleaning methods for 80% of the area to minimize water use.
Regulator 2: That's acceptable. However, we need you to submit the exact water source details for the remaining 20% by next Friday.
Applicant: Understood, we will expedite that.
Regulator 1: Great. Once we have that, we can move to the final approval stage.`;

  const handleGenerateGist = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/meeting-gist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ transcript: mockTranscript })
      });
      const data = await res.json();
      setGist(data.summary);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6 fade-up">
      <header>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-500/10 rounded-xl">
            <Users className="text-indigo-400" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-white">Review Meeting Minutes</h1>
        </div>
        <p className="text-zinc-400">Access AI-generated automatic gists from your regulator review meetings.</p>
      </header>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-4 bg-zinc-950/50 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-medium text-white">Solar Park Alpha - Final Review</span>
          </div>
          <span className="text-xs text-zinc-500">{new Date().toLocaleDateString()}</span>
        </div>
        
        <div className="p-6 grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Raw Transcript Snippet</h3>
            <div className="bg-zinc-950 border border-white/5 rounded-xl p-4 text-sm text-zinc-400 font-mono leading-relaxed h-[200px] overflow-y-auto">
              {mockTranscript}
            </div>
          </div>
          
          <div className="flex flex-col">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">AI Meeting Gist</h3>
            
            {!gist ? (
              <div className="flex-1 bg-indigo-500/5 border border-indigo-500/10 rounded-xl flex items-center justify-center p-6 text-center">
                <div>
                  <Users className="mx-auto text-indigo-400/50 mb-3" size={32} />
                  <p className="text-sm text-zinc-400 mb-4">Generate an official summary of action items and decisions from this transcript.</p>
                  <button
                    onClick={handleGenerateGist}
                    disabled={loading}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    {loading ? 'Summarizing...' : 'Generate Auto-Gist'}
                  </button>
                </div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 bg-zinc-950 border border-indigo-500/30 rounded-xl p-5 relative">
                <div className="absolute top-0 right-0 p-2">
                   <div className="flex items-center gap-1 bg-indigo-500/20 text-indigo-300 text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                     <Zap size={10} /> AI Generated
                   </div>
                </div>
                <h4 className="text-sm font-bold text-white mb-2">Key Action Items</h4>
                <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                  {gist}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


export default function ApplicantDashboard() {
  return (
    <Routes>
      <Route path="/" element={<ApplicantHome />} />
      <Route path="/applications" element={<MyApplications />} />
      <Route path="/submit" element={<SubmitProject />} />
      <Route path="/advisor" element={<PermissionAdvisor />} />
      <Route path="/simulation" element={<ImpactSimulation />} />
      <Route path="/meetings" element={<ReviewMeetings />} />
      <Route path="/compliance" element={<ComplianceReports />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="*" element={<Navigate to="/applicant" replace />} />
    </Routes>
  );
}
