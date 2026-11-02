import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

import Navbar from './components/Navbar';
import HomeDashboard from './components/HomeDashboard';
import SubjectDetail from './components/SubjectDetail';
import QuizArena from './components/QuizArena';
import TopicSummaries from './components/TopicSummaries';
import ProfileBadges from './components/ProfileBadges';

import staticData from './data/data.json';

const API_BASE = "http://127.0.0.1:8000/api";

export default function App() {
  const [subjects, setSubjects] = useState(staticData.subjects || []);
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'subject_detail', 'quiz', 'summaries', 'profile'
  
  // Seçili Ders ve Test
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [testList, setTestList] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [quizMode, setQuizMode] = useState('practice'); // 'practice' veya 'exam'

  // Quiz Durumu
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // İlerleme (Local storage destekli)
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem('ortaokul_progress');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("localStorage error", e);
    }
    return {
      total_points: 100,
      solved_count: 0,
      correct_count: 0,
      wrong_count: 0,
      badges: ["6. Sınıf Kaşifi 🚀"],
      completed_tests: {},
      history: []
    };
  });

  // Konu Özetleri
  const [summaries, setSummaries] = useState(staticData.summaries || []);

  useEffect(() => {
    // API varsa API'den çek, yoksa static veriyi kullan (Vercel vb. ortamlarda kusursuz çalışır)
    fetch(`${API_BASE}/subjects`)
      .then(r => r.json())
      .then(data => {
        if (data && data.length > 0) setSubjects(data);
      })
      .catch(() => {
        // Backend yoksa staticData zaten devrede
        setSubjects(staticData.subjects || []);
      });

    fetch(`${API_BASE}/summaries`)
      .then(r => r.json())
      .then(data => {
        if (data && data.length > 0) setSummaries(data);
      })
      .catch(() => {
        setSummaries(staticData.summaries || []);
      });
  }, []);

  // Progress değiştikçe localStorage'a kaydet
  useEffect(() => {
    try {
      localStorage.setItem('ortaokul_progress', JSON.stringify(progress));
    } catch (e) {
      console.warn(e);
    }
  }, [progress]);

  // Zamanlayıcı
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Ders Seçimi
  const handleSelectSubject = (subj) => {
    setSelectedSubject(subj);
    
    // API dene, başarısızsa yerel veriden filtrele
    fetch(`${API_BASE}/tests?subject=${encodeURIComponent(subj.name)}`)
      .then(r => r.json())
      .then(data => {
        setTestList(data);
        setActiveTab('subject_detail');
      })
      .catch(() => {
        const allQ = (staticData.questions || []).filter(
          q => q.subject.toLowerCase() === subj.name.toLowerCase()
        );
        const testNames = {
          1: { title: "Test 1: Temel Seviye", diff: "Kolay", icon: "🌱" },
          2: { title: "Test 2: Kavrama Testi", diff: "Kolay-Orta", icon: "🌿" },
          3: { title: "Test 3: Geliştirme Testi", diff: "Orta", icon: "🌳" },
          4: { title: "Test 4: Yeni Nesil Alıştırma", diff: "Orta-Zor", icon: "⚡" },
          5: { title: "Test 5: Sınav Provası (Zor)", diff: "Zor", icon: "🏆" }
        };
        const tests = [];
        for (let t_no = 1; t_no <= 5; t_no++) {
          const tQ = allQ.filter(q => q.test_no === t_no);
          const meta = testNames[t_no] || { title: `Test ${t_no}`, diff: "Orta", icon: "📝" };
          const topic = tQ[0]?.topic || subj.topics[t_no - 1] || "Genel Konu";
          tests.push({
            test_no: t_no,
            title: meta.title,
            topic: topic,
            difficulty: meta.diff,
            icon: meta.icon,
            count: tQ.length || 20
          });
        }
        setTestList(tests);
        setActiveTab('subject_detail');
      });
  };

  // Test Başlatma
  const handleStartTest = (testItem, mode = 'practice') => {
    setSelectedTest(testItem);
    setQuizMode(mode);
    setCurrentIndex(0);
    setUserAnswers({});
    setShowExplanation(false);
    setQuizFinished(false);
    setTimer(0);
    setIsTimerRunning(true);

    fetch(`${API_BASE}/questions?subject=${encodeURIComponent(selectedSubject.name)}&test_no=${testItem.test_no}`)
      .then(r => r.json())
      .then(data => {
        if (data && data.length > 0) {
          setQuestions(data);
          setActiveTab('quiz');
        } else {
          loadStaticQuestions(testItem);
        }
      })
      .catch(() => {
        loadStaticQuestions(testItem);
      });
  };

  const loadStaticQuestions = (testItem) => {
    const filtered = (staticData.questions || []).filter(
      q => q.subject.toLowerCase() === selectedSubject.name.toLowerCase() && q.test_no === testItem.test_no
    );
    setQuestions(filtered);
    setActiveTab('quiz');
  };

  const handleSelectOption = (optIdx) => {
    const currentQuestion = questions[currentIndex];
    if (userAnswers[currentQuestion.id] !== undefined && quizMode === 'practice') {
      return;
    }
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optIdx
    }));

    if (quizMode === 'practice') {
      setShowExplanation(true);
      if (optIdx === currentQuestion.correct_answer) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 }
        });
      }
    }
  };

  const finishQuiz = () => {
    setIsTimerRunning(false);
    setQuizFinished(true);

    let correct = 0;
    let wrong = 0;
    let empty = 0;

    questions.forEach(q => {
      const ans = userAnswers[q.id];
      if (ans === undefined) {
        empty++;
      } else if (ans === q.correct_answer) {
        correct++;
      } else {
        wrong++;
      }
    });

    const score = Math.round((correct / (questions.length || 1)) * 100);
    const earned_points = correct * 10;

    if (score >= 70) {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
      });
    }

    // İlerlemeyi güncelle (Local + API)
    setProgress(prev => {
      const newSolved = prev.solved_count + questions.length;
      const newCorrect = prev.correct_count + correct;
      const newWrong = prev.wrong_count + wrong;
      const newPoints = prev.total_points + earned_points;

      const badges = new Set(prev.badges || []);
      if (newSolved >= 20) badges.add("İlk 20'lik Barajı Aşıldı! 🎯");
      if (newSolved >= 100) badges.add("100 Soru Şampiyonu 💯");
      if (newSolved >= 300) badges.add("6. Sınıf Profesörü 🎓");
      if (correct === questions.length && questions.length >= 20) badges.add("Kusursuz 20/20 Tam Puan! ⭐");
      if (selectedSubject.name === "Matematik" && correct >= 15) badges.add("Matematik Ustası 📐");
      if (selectedSubject.name === "Bilim Uygulamaları" && correct >= 15) badges.add("Genç Mucit 🚀");

      const completed = { ...(prev.completed_tests || {}) };
      if (selectedTest?.test_no) {
        completed[`${selectedSubject.name}_${selectedTest.test_no}`] = {
          score,
          correct,
          date: "Bugün"
        };
      }

      const history = [...(prev.history || [])];
      history.push({
        grade: 6,
        subject: selectedSubject.name,
        test_no: selectedTest?.test_no || 1,
        correct,
        wrong,
        empty,
        score,
        earned_points,
        time: timer
      });

      return {
        ...prev,
        total_points: newPoints,
        solved_count: newSolved,
        correct_count: newCorrect,
        wrong_count: newWrong,
        badges: Array.from(badges),
        completed_tests: completed,
        history
      };
    });

    // Varsa Backend'e de gönder
    fetch(`${API_BASE}/progress/submit-exam`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grade: 6,
        subject: selectedSubject.name,
        test_no: selectedTest?.test_no || 1,
        total_questions: questions.length,
        correct,
        wrong,
        empty,
        score,
        time_spent_seconds: timer
      })
    }).catch(() => {
      // Offline modda sessizce devam
    });
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'Kolay':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Kolay-Orta':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Orta':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Orta-Zor':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Zor':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        progress={progress}
        onHomeClick={() => { setActiveTab('home'); setIsTimerRunning(false); }}
      />

      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full">
        {activeTab === 'home' && (
          <HomeDashboard 
            subjects={subjects}
            progress={progress}
            onSelectSubject={handleSelectSubject}
          />
        )}

        {activeTab === 'subject_detail' && selectedSubject && (
          <SubjectDetail 
            selectedSubject={selectedSubject}
            testList={testList}
            progress={progress}
            onBack={() => setActiveTab('home')}
            onStartTest={handleStartTest}
            getDifficultyBadge={getDifficultyBadge}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizArena 
            selectedSubject={selectedSubject}
            selectedTest={selectedTest}
            questions={questions}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            userAnswers={userAnswers}
            showExplanation={showExplanation}
            setShowExplanation={setShowExplanation}
            quizFinished={quizFinished}
            quizMode={quizMode}
            timer={timer}
            formatTime={formatTime}
            getDifficultyBadge={getDifficultyBadge}
            onSelectOption={handleSelectOption}
            onFinishQuiz={finishQuiz}
            onRestartTest={() => handleStartTest(selectedTest, quizMode)}
            onExitQuiz={() => {
              if (confirm("Testten çıkmak istediğine emin misin?")) {
                setActiveTab('subject_detail');
                setIsTimerRunning(false);
              }
            }}
          />
        )}

        {activeTab === 'summaries' && (
          <TopicSummaries 
            summaries={summaries}
            onBack={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileBadges 
            progress={progress}
            onBack={() => setActiveTab('home')}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400 font-medium">
        6. Sınıf Sınav & Başarı Asistanı • İyi Çalışmalar! 🚀
      </footer>
    </div>
  );
}
