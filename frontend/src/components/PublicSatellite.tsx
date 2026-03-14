import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Map as MapIcon, Calendar, Camera, Play, Pause } from 'lucide-react';

export default function PublicSatellite() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setSliderValue(0);
      let val = 0;
      const interval = setInterval(() => {
        val += 2;
        if (val > 100) {
          clearInterval(interval);
          setIsPlaying(false);
        } else {
          setSliderValue(val);
        }
      }, 50);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 fade-up">
      <header>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-500/10 rounded-xl">
            <MapIcon className="text-indigo-400" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-white">Before vs After Tracking</h1>
        </div>
        <p className="text-zinc-400">View public satellite imagery to track deforestation and land use change over time.</p>
      </header>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-6 mb-6 items-start md:items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Western Ghats Highway Project</h3>
            <p className="text-sm text-zinc-400 flex items-center gap-2">
              <Calendar size={14} /> 2022 vs 2026 Analysis
            </p>
          </div>
          <button 
            onClick={togglePlay}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors ${
              isPlaying ? 'bg-amber-500/20 text-amber-400' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />} 
            {isPlaying ? 'Pause Timelapse' : 'Play Timelapse'}
          </button>
        </div>

        <div className="relative h-[60vh] rounded-xl overflow-hidden border border-zinc-800 cursor-ew-resize select-none">
          {/* After image (background) */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/satellite_after.png')" }}
          >
            <div className="absolute top-4 right-4 bg-zinc-950/80 backdrop-blur px-3 py-1.5 rounded-lg border border-red-500/30 text-xs font-bold text-red-400 flex items-center gap-2">
              <Camera size={14} /> After (2026)
            </div>
          </div>

          {/* Before image (foreground) */}
          <div 
            className="absolute inset-y-0 left-0 bg-cover bg-left group"
            style={{ 
              width: `${sliderValue}%`, 
              backgroundImage: "url('https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1200&auto=format&fit=crop')",
              borderRight: "4px solid #10b981"
            }}
          >
            <div className="absolute top-4 left-4 bg-zinc-950/80 backdrop-blur px-3 py-1.5 rounded-lg border border-emerald-500/30 text-xs font-bold text-emerald-400 flex items-center gap-2">
              <Camera size={14} /> Before (2022)
            </div>

            {/* Drag Handle */}
            <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-12 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] flex items-center justify-center cursor-ew-resize" />
          </div>

          <input 
            type="range" 
            min="0" max="100" 
            value={sliderValue} 
            onChange={(e) => setSliderValue(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
          />
        </div>
      </div>
    </div>
  );
}
