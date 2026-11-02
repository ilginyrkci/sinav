import React from 'react';
import { Trophy, Zap } from 'lucide-react';

export default function ProfileBadges({ progress, onBack }) {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Başarılarım & Rozetlerim
        </h2>
        <button
          onClick={onBack}
          className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl cursor-pointer"
        >
          ← Derslere Dön
        </button>
      </div>

      {/* Profil Kutusu */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-3xl shadow-xs">
          🦁
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-800">6. Sınıf Yıldız Öğrencisi</h3>
          <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-0.5 rounded-full text-xs font-bold text-amber-700 mt-1">
            <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            Toplam: {progress.total_points} Puan
          </div>
        </div>
      </div>

      {/* Rozetler */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
        <h4 className="font-extrabold text-xs text-slate-500 uppercase tracking-wider">
          Kazanılan Rozetler
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {progress.badges.map((b, idx) => (
            <div key={idx} className="bg-amber-50/70 border border-amber-200/80 p-2.5 rounded-2xl flex items-center gap-2">
              <span className="text-xl">🎖️</span>
              <div>
                <div className="text-xs font-bold text-amber-900">{b}</div>
                <div className="text-[10px] text-amber-700/80">Açıldı</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Çözülen Testler Geçmişi */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
        <h4 className="font-extrabold text-xs text-slate-500 uppercase tracking-wider">
          Son Çözülen Testler
        </h4>
        {progress.history && progress.history.length > 0 ? (
          <div className="space-y-2">
            {progress.history.slice(-5).reverse().map((h, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs">
                <div>
                  <span className="font-bold text-slate-800">{h.subject}</span>
                  <span className="text-slate-400 ml-1.5">(Test {h.test_no})</span>
                </div>
                <div className="flex items-center gap-2.5 font-semibold">
                  <span className="text-emerald-600">{h.correct} D</span>
                  <span className="text-rose-600">{h.wrong} Y</span>
                  <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-lg font-bold">
                    %{h.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400">Henüz tamamlanan test bulunmuyor. Bir test seç ve başla!</p>
        )}
      </div>
    </div>
  );
}
