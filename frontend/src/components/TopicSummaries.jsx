import React from 'react';

export default function TopicSummaries({ summaries, onBack }) {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            6. Sınıf Konu Özetleri & Püf Noktalar 📖
          </h2>
          <p className="text-xs text-slate-500">
            Her ders için sınavda en çok çıkan altın kurallar!
          </p>
        </div>
        <button
          onClick={onBack}
          className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl cursor-pointer"
        >
          ← Derslere Dön
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {summaries.map(s => (
          <div key={s.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 inline-block mb-2">
                {s.subject}
              </span>
              <h3 className="font-extrabold text-sm text-slate-800 mb-2">{s.title}</h3>
              <ul className="space-y-1.5">
                {s.points.map((pt, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                    <span className="text-indigo-500 font-bold">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
