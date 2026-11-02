import React from 'react';
import { Award, Zap } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, progress, onHomeClick }) {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          onClick={onHomeClick}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg shadow-md group-hover:scale-105 transition-transform">
            🚀
          </div>
          <div>
            <span className="font-extrabold text-lg text-slate-900 tracking-tight">
              6. Sınıf Sınav Odası
            </span>
            <span className="text-[11px] block text-indigo-600 font-bold -mt-0.5">
              Tüm Dersler • 100 Soru Bankası
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('summaries')}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
              activeTab === 'summaries' 
                ? 'bg-indigo-50 text-indigo-600 border-indigo-200' 
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            📖 Konu Özetleri
          </button>
          
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-amber-700 font-bold text-xs shadow-xs">
            <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>{progress.total_points} Puan</span>
          </div>

          <button 
            onClick={() => setActiveTab('profile')}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'profile' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
            title="Başarılarım & Rozetler"
          >
            <Award className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
