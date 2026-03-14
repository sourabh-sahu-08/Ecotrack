import { motion } from 'motion/react';
import { User, Mail, Shield, Calendar, Edit2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#FF9933] via-[#ffffff] to-[#138808] rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex flex-col md:flex-row items-center gap-8 bg-[#0a1935]/80 backdrop-blur-xl p-8 rounded-3xl border border-white/10">
          <div className="relative">
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#FF9933]/20 to-[#138808]/20 border-2 border-[#FF9933]/30 flex items-center justify-center text-4xl text-amber-300 font-black">
              {user.name[0].toUpperCase()}
            </div>
            <button className="absolute -bottom-2 -right-2 p-2 bg-[#FF9933] rounded-xl text-white shadow-lg hover:scale-110 transition-transform">
              <Edit2 size={16} />
            </button>
          </div>
          
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-3xl font-black text-white">{user.name}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <div className="flex items-center gap-2 text-zinc-400">
                <Mail size={16} />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-bold uppercase tracking-wider">
                {user.role}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats/Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Role Type', value: user.role, icon: Shield, color: 'text-blue-400' },
          { label: 'Member Since', value: 'March 2026', icon: Calendar, color: 'text-emerald-400' },
          { label: 'Account Status', value: 'Verified', icon: User, color: 'text-amber-400' },
        ].map((item, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={item.label}
            className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors"
          >
            <item.icon size={20} className={`${item.color} mb-4`} />
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{item.label}</p>
            <p className="text-lg font-bold text-white mt-1">{item.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Account Details */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 bg-white/5">
          <h2 className="text-lg font-bold text-white">Account Information</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Full Name</p>
              <p className="text-white font-medium">{user.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Email Address</p>
              <p className="text-white font-medium">{user.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Organization</p>
              <p className="text-white font-medium">{user.role === 'Regulator' ? 'MoEFCC, Govt. of India' : 'Public Observer'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Location</p>
              <p className="text-white font-medium">New Delhi, India</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
