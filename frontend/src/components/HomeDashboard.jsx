import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function HomeDashboard({ subjects, progress, onSelectSubject }) {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white p-6 sm:p-8 shadow-lg shadow-indigo-100">
        <div className="relative z-10 max-w-xl">
          <span className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            6. Sınıf MEB Müfredatı
          </span>
          <h1 className="text-2xl sm:text-4xl font-black mb-2">
            Dersini Seç, Testini Çöz! 🎯
          </h1>
          <p className="text-indigo-100 text-xs sm:text-sm mb-4">
            Her dersten 100 soru (20'şer soruluk 5 test grubu: Kolay, Orta, Zor). Hemen başla, netlerini yükselt!
          </p>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-semibold">
            <span className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
              ✨ 7 Temel Branş
            </span>
            <span className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
              📝 700 Kaliteli Soru
            </span>
            <span className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
              💡 Açıklamalı Çözümler
            </span>
          </div>
        </div>
        <div className="absolute right-4 bottom-2 text-7xl opacity-15 select-none pointer-events-none">
          📚
        </div>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-base">
            📝
          </div>
          <div>
            <div className="text-xl font-black text-slate-800">{progress.solved_count}</div>
            <div className="text-[11px] text-slate-400 font-semibold">Çözülen Soru</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-base">
            🎯
          </div>
          <div>
            <div className="text-xl font-black text-slate-800">{progress.correct_count}</div>
            <div className="text-[11px] text-slate-400 font-semibold">Doğru Cevap</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-base">
            ⚡
          </div>
          <div>
            <div className="text-xl font-black text-slate-800">
              {progress.solved_count > 0 ? Math.round((progress.correct_count / progress.solved_count) * 100) : 0}%
            </div>
            <div className="text-[11px] text-slate-400 font-semibold">Başarı Oranı</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-base">
            🎖️
          </div>
          <div>
            <div className="text-xl font-black text-slate-800">{progress.badges.length}</div>
            <div className="text-[11px] text-slate-400 font-semibold">Kazanılan Rozet</div>
          </div>
        </div>
      </div>

      {/* Ders Kartları */}
      <div>
        <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
          <span>6. Sınıf Dersleri</span>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
            7 Branş
          </span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map(s => (
            <div
              key={s.id}
              onClick={() => onSelectSubject(s)}
              className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl p-2.5 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform">
                    {s.icon}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700">
                    100 Soru
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {s.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {s.topics.slice(0, 3).join(", ")} ve daha fazlası...
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                <span>5 Test Grubu (20'şer Soru)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
