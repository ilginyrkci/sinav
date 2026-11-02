import React from 'react';
import { ArrowLeft, BookOpen, Clock, Check } from 'lucide-react';

export default function SubjectDetail({ 
  selectedSubject, 
  testList, 
  progress, 
  onBack, 
  onStartTest, 
  getDifficultyBadge 
}) {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Derslere Dön
        </button>

        <div className="flex items-center gap-2">
          <span className="text-2xl">{selectedSubject.icon}</span>
          <h2 className="text-xl font-black text-slate-800">{selectedSubject.name}</h2>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <h3 className="text-sm font-extrabold text-slate-700 uppercase tracking-wider mb-2">
          Test Grupları (Her biri 20 Soru)
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Soruları ister anında çözümlü <b>Alıştırma Modu</b>'nda, istersen süreli <b>Sınav Modu</b>'nda çözebilirsin.
        </p>

        <div className="space-y-4">
          {testList.map((test) => {
            const completedKey = `${selectedSubject.name}_${test.test_no}`;
            const isDone = progress.completed_tests && progress.completed_tests[completedKey];

            return (
              <div
                key={test.test_no}
                className="bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-2xl p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <span className="text-2xl p-2 bg-white rounded-xl shadow-2xs border border-slate-100">
                    {test.icon}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-slate-800">{test.title}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getDifficultyBadge(test.difficulty)}`}>
                        {test.difficulty}
                      </span>
                      {isDone && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                          <Check className="w-3 h-3" /> Çözüldü (%{isDone.score})
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Konu: <span className="font-semibold text-slate-700">{test.topic}</span> • 20 Soru
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onStartTest(test, 'practice')}
                    className="flex-1 sm:flex-none text-xs font-bold px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-indigo-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Alıştırma Modu
                  </button>
                  <button
                    onClick={() => onStartTest(test, 'exam')}
                    className="flex-1 sm:flex-none text-xs font-bold px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Sınav Modu
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
