import React from 'react';
import { 
  ArrowLeft, Clock, RefreshCw, CheckCircle, XCircle, 
  ChevronRight, Sparkles 
} from 'lucide-react';

export default function QuizArena({
  selectedSubject,
  selectedTest,
  questions,
  currentIndex,
  setCurrentIndex,
  userAnswers,
  showExplanation,
  setShowExplanation,
  quizFinished,
  quizMode,
  timer,
  formatTime,
  getDifficultyBadge,
  onSelectOption,
  onFinishQuiz,
  onRestartTest,
  onExitQuiz
}) {
  const currentQuestion = questions[currentIndex];

  if (!currentQuestion) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Üst Bilgi Barı */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
        <button
          onClick={onExitQuiz}
          className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Testten Çık
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
            {selectedSubject.name} • {selectedTest?.title}
          </span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl">
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>{formatTime(timer)}</span>
        </div>
      </div>

      {/* Sonuç Karnesi */}
      {quizFinished ? (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center text-3xl">
            🎉
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Testi Tamamladın!</h2>
            <p className="text-xs text-slate-500 mt-1">
              {selectedSubject.name} - {selectedTest?.title} karnen:
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-emerald-700">
              <div className="text-2xl font-black">
                {questions.filter(q => userAnswers[q.id] === q.correct_answer).length}
              </div>
              <div className="text-[11px] font-bold mt-1">Doğru</div>
            </div>
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 text-rose-700">
              <div className="text-2xl font-black">
                {questions.filter(q => userAnswers[q.id] !== undefined && userAnswers[q.id] !== q.correct_answer).length}
              </div>
              <div className="text-[11px] font-bold mt-1">Yanlış</div>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-amber-700">
              <div className="text-2xl font-black">
                {questions.filter(q => userAnswers[q.id] === undefined).length}
              </div>
              <div className="text-[11px] font-bold mt-1">Boş</div>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={onRestartTest}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Tekrar Çöz
            </button>
            <button
              onClick={onExitQuiz}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              Test Listesine Dön
            </button>
          </div>
        </div>
      ) : (
        /* Soru Kartı */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">
              <span>{currentQuestion.topic}</span>
              <span>•</span>
              <span className={`px-2 py-0.5 rounded-md border ${getDifficultyBadge(currentQuestion.difficulty)}`}>
                {currentQuestion.difficulty}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              {currentQuestion.question}
            </h3>
          </div>

          {/* Şıklar */}
          <div className="space-y-2.5">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = userAnswers[currentQuestion.id] === idx;
              const isCorrect = currentQuestion.correct_answer === idx;
              const isAnswered = userAnswers[currentQuestion.id] !== undefined;

              let btnClass = "bg-slate-50/80 hover:bg-indigo-50/40 border-slate-200 text-slate-700";
              let letterClass = "bg-white border-slate-300 text-slate-600";

              if (quizMode === 'practice' && isAnswered) {
                if (isCorrect) {
                  btnClass = "bg-emerald-50 border-emerald-400 text-emerald-900 font-medium";
                  letterClass = "bg-emerald-500 text-white border-emerald-500";
                } else if (isSelected) {
                  btnClass = "bg-rose-50 border-rose-400 text-rose-900 font-medium";
                  letterClass = "bg-rose-500 text-white border-rose-500";
                }
              } else if (isSelected) {
                btnClass = "bg-indigo-50 border-indigo-400 text-indigo-900 font-medium ring-1 ring-indigo-300";
                letterClass = "bg-indigo-600 text-white border-indigo-600";
              }

              const letters = ["A", "B", "C", "D"];

              return (
                <button
                  key={idx}
                  onClick={() => onSelectOption(idx)}
                  className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-center gap-3.5 cursor-pointer ${btnClass}`}
                >
                  <div className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center border text-xs flex-shrink-0 ${letterClass}`}>
                    {letters[idx]}
                  </div>
                  <div className="text-xs sm:text-sm flex-1">
                    {opt}
                  </div>
                  {quizMode === 'practice' && isAnswered && isCorrect && (
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  )}
                  {quizMode === 'practice' && isAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Çözüm İpucu */}
          {quizMode === 'practice' && showExplanation && currentQuestion.explanation && (
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-2.5 animate-fadeIn">
              <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">💡 Çözüm İpucu:</span>
                {currentQuestion.explanation}
              </div>
            </div>
          )}

          {/* Navigasyon Butonları */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              disabled={currentIndex === 0}
              onClick={() => {
                setCurrentIndex(i => i - 1);
                setShowExplanation(userAnswers[questions[currentIndex - 1]?.id] !== undefined);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              Önceki Soru
            </button>

            {/* Soru Atlama Kareleri */}
            <div className="hidden sm:flex items-center gap-1">
              {questions.map((q, idx) => {
                const ans = userAnswers[q.id];
                let dotColor = "bg-slate-200 text-slate-600";
                if (ans !== undefined) {
                  dotColor = "bg-indigo-600 text-white";
                }
                if (idx === currentIndex) {
                  dotColor += " ring-2 ring-indigo-300 ring-offset-1";
                }
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setShowExplanation(userAnswers[q.id] !== undefined);
                    }}
                    className={`w-6 h-6 rounded-md text-[10px] font-bold flex items-center justify-center transition-all cursor-pointer ${dotColor}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => {
                  setCurrentIndex(i => i + 1);
                  setShowExplanation(userAnswers[questions[currentIndex + 1]?.id] !== undefined);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
              >
                Sonraki Soru <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onFinishQuiz}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" /> Testi Bitir
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
