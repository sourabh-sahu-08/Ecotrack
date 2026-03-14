import { motion } from 'motion/react';
import { CheckCircle, FileText } from 'lucide-react';
import { CATEGORY_CHECKLISTS, WORKFLOW_STAGES } from '../constants/checklists';

export function WorkflowTimeline({ stage }: { stage: string }) {
  const currentIndex = WORKFLOW_STAGES.indexOf(stage);
  return (
    <div className="py-6">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-800 -translate-y-1/2 z-0" />
        {WORKFLOW_STAGES.map((s, i) => (
          <div key={s} className="relative z-10 flex flex-col items-center gap-2 group">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
              i <= currentIndex ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 
              'bg-zinc-950 border-zinc-800 text-zinc-600'
            }`}>
              {i < currentIndex ? <CheckCircle size={14} /> : <span className="text-[10px] font-bold">{i + 1}</span>}
            </div>
            <span className={`text-[10px] absolute -bottom-6 font-bold uppercase tracking-tighter whitespace-nowrap ${
              i === currentIndex ? 'text-emerald-400' : 'text-zinc-600'
            }`}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DocumentChecklist({ category, projectFiles = [], onUpload }: { category: string, projectFiles?: any[], onUpload?: (doc: string) => void }) {
  const docs = CATEGORY_CHECKLISTS[category] || [];
  const uploadedCount = projectFiles.length;
  const percentage = docs.length > 0 ? Math.round((uploadedCount / docs.length) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Document Completeness</h3>
        <span className="text-xl font-black text-emerald-400">{percentage}%</span>
      </div>
      <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} className="h-full bg-emerald-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
        {docs.map(doc => {
          const isUploaded = projectFiles.some(f => f.type === doc || (f.name && f.name.includes(doc)));
          return (
            <div key={doc} className={`p-4 rounded-xl border flex items-center justify-between ${
              isUploaded ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-zinc-950 border-zinc-800/50'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isUploaded ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-900 text-zinc-600'}`}>
                  <FileText size={16} />
                </div>
                <span className={`text-xs font-medium ${isUploaded ? 'text-zinc-200' : 'text-zinc-500'}`}>{doc}</span>
              </div>
              {isUploaded ? (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Verified</span>
                  <CheckCircle size={16} className="text-emerald-500" />
                </div>
              ) : (
                <button 
                  onClick={() => onUpload?.(doc)}
                  className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-wider"
                >
                  {onUpload ? 'Upload' : 'Missing'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const getProjectCategory = (desc: string) => {
  const match = desc.match(/\[Category: (.*?)\]/);
  return match ? match[1] : 'Infrastructure Projects';
};

export const getProjectStage = (app: any, alerts: any[] = []) => {
  if (app.status === 'Approved') return 'Approved';
  if (app.status === 'Rejected') return 'Rejected';
  const appAlerts = alerts.filter(a => a.projectId === app.id && a.severity === 'Deficiency');
  if (appAlerts.length > 0) return 'Deficiency raised';
  if (app.status === 'Under Review') return 'Committee review';
  if (app.status === 'Pending') return 'Under scrutiny';
  return 'Submitted';
};
