import { motion } from 'motion/react';
import { Settings as SettingsIcon, Bell, Lock, Eye, Globe, Shield } from 'lucide-react';

export default function Settings() {
  const sections = [
    { title: 'Security', icon: Lock, items: ['Change Password', 'Two-Factor Authentication', 'Login Activity'], color: 'text-amber-400' },
    { title: 'Notifications', icon: Bell, items: ['Email Alerts', 'In-App Notifications', 'Meeting Reminders'], color: 'text-blue-400' },
    { title: 'Privacy', icon: Eye, items: ['Profile Visibility', 'Public Contributions', 'Data Export'], color: 'text-emerald-400' },
    { title: 'Regional', icon: Globe, items: ['Interface Language', 'Time Zone', 'GIS Map Default Layer'], color: 'text-purple-400' },
    { title: 'Permissions', icon: Shield, items: ['API Access', 'Authorized Devices', 'Role Management'], color: 'text-red-400' },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
          <SettingsIcon size={24} className="text-[#FF9933]" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">System Settings</h1>
          <p className="text-sm text-zinc-500 font-medium">Configure your PARIVESH 3.0 experience</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {sections.map((section, idx) => (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={section.title}
            className="group relative overflow-hidden bg-white/3 border border-white/10 rounded-2xl hover:bg-white/5 transition-all duration-300"
          >
            <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${section.color}`}>
                  <section.icon size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{section.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {section.items.map(item => (
                      <span key={item} className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-zinc-500 uppercase tracking-wider font-bold">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-[#FF9933] hover:border-[#FF9933] transition-all duration-300">
                Manage
              </button>
            </div>
            
            {/* Background Accent */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-current ${section.color} opacity-[0.02] -mr-16 -mt-16 rounded-full blur-3xl group-hover:opacity-[0.05] transition-opacity`} />
          </motion.div>
        ))}
      </div>

      <div className="mt-12 p-6 rounded-2xl bg-red-500/5 border border-red-500/10">
        <h3 className="text-red-400 font-bold mb-2">Danger Zone</h3>
        <p className="text-sm text-zinc-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
        <button className="px-6 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold hover:bg-red-500 hover:text-white transition-all duration-300">
          Deactivate Account
        </button>
      </div>
    </div>
  );
}
