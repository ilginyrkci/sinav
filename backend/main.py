import json
import os
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="6. Sınıf Sınav Hazırlık API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FILE = os.path.join(os.path.dirname(__file__), "data.json")
PROGRESS_FILE = os.path.join(os.path.dirname(__file__), "user_progress.json")

def load_data():
    if not os.path.exists(DATA_FILE):
        return {"grades": [], "subjects": [], "questions": [], "summaries": []}
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def load_progress():
    if not os.path.exists(PROGRESS_FILE):
        return {
            "total_points": 100,
            "solved_count": 0,
            "correct_count": 0,
            "wrong_count": 0,
            "badges": ["6. Sınıf Kaşifi 🚀"],
            "completed_tests": {}, # { "mat_1": true }
            "history": []
        }
    with open(PROGRESS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_progress(progress):
    with open(PROGRESS_FILE, "w", encoding="utf-8") as f:
        json.dump(progress, f, ensure_ascii=False, indent=2)

class ExamSubmitRequest(BaseModel):
    grade: int = 6
    subject: str
    test_no: Optional[int] = 1
    total_questions: int
    correct: int
    wrong: int
    empty: int
    score: int
    time_spent_seconds: int

@app.get("/")
def home():
    return {"status": "ok", "message": "6. Sınıf Sınav Hazırlık API Hazır! 🚀"}

@app.get("/api/subjects")
def get_subjects():
    data = load_data()
    return data.get("subjects", [])

@app.get("/api/tests")
def get_tests(subject: str):
    data = load_data()
    all_q = [q for q in data.get("questions", []) if q.get("subject", "").lower() == subject.lower()]
    
    # 5 test grubunu derle
    tests_summary = []
    test_names = {
        1: ("Test 1: Temel Seviye", "Kolay", "🌱"),
        2: ("Test 2: Kavrama Testi", "Kolay-Orta", "🌿"),
        3: ("Test 3: Geliştirme Testi", "Orta", "🌳"),
        4: ("Test 4: Yeni Nesil Alıştırma", "Orta-Zor", "⚡"),
        5: ("Test 5: Sınav Provası (Zor)", "Zor", "🏆")
    }
    
    for t_no in range(1, 6):
        t_questions = [q for q in all_q if q.get("test_no") == t_no]
        t_title, t_diff, t_icon = test_names.get(t_no, (f"Test {t_no}", "Orta", "📝"))
        topic = t_questions[0].get("topic", "Genel Konu") if t_questions else "Genel"
        tests_summary.append({
            "test_no": t_no,
            "title": t_title,
            "topic": topic,
            "difficulty": t_diff,
            "icon": t_icon,
            "count": len(t_questions)
        })
    return tests_summary

@app.get("/api/questions")
def get_questions(
    subject: str,
    test_no: Optional[int] = None
):
    data = load_data()
    questions = [q for q in data.get("questions", []) if q.get("subject", "").lower() == subject.lower()]
    if test_no:
        questions = [q for q in questions if q.get("test_no") == test_no]
    return questions

@app.get("/api/summaries")
def get_summaries(subject: Optional[str] = None):
    data = load_data()
    summaries = data.get("summaries", [])
    if subject:
        summaries = [s for s in summaries if s.get("subject", "").lower() == subject.lower()]
    return summaries

@app.get("/api/progress")
def get_user_progress():
    return load_progress()

@app.post("/api/progress/submit-exam")
def submit_exam(req: ExamSubmitRequest):
    prog = load_progress()
    prog["solved_count"] += req.total_questions
    prog["correct_count"] += req.correct
    prog["wrong_count"] += req.wrong
    
    # Puanlama (+10 doğru başına)
    earned_points = (req.correct * 10)
    prog["total_points"] += earned_points
    
    # Tamamlanan test kaydı
    if req.test_no:
        test_key = f"{req.subject}_{req.test_no}"
        prog.setdefault("completed_tests", {})[test_key] = {
            "score": req.score,
            "correct": req.correct,
            "date": "Bugün"
        }
    
    # Rozet Kontrolü
    badges = set(prog.get("badges", []))
    if prog["solved_count"] >= 20:
        badges.add("İlk 20'lik Barajı Aşıldı! 🎯")
    if prog["solved_count"] >= 100:
        badges.add("100 Soru Şampiyonu 💯")
    if prog["solved_count"] >= 300:
        badges.add("6. Sınıf Profesörü 🎓")
    if req.correct == req.total_questions and req.total_questions >= 20:
        badges.add("Kusursuz 20/20 Tam Puan! ⭐")
    if req.subject == "Matematik" and req.correct >= 15:
        badges.add("Matematik Ustası 📐")
    if req.subject == "Bilim Uygulamaları" and req.correct >= 15:
        badges.add("Genç Mucit 🚀")
        
    prog["badges"] = list(badges)
    
    # Geçmiş
    history_item = {
        "grade": req.grade,
        "subject": req.subject,
        "test_no": req.test_no,
        "correct": req.correct,
        "wrong": req.wrong,
        "empty": req.empty,
        "score": req.score,
        "earned_points": earned_points,
        "time": req.time_spent_seconds
    }
    prog.setdefault("history", []).append(history_item)
    save_progress(prog)
    return {"message": "Test kaydedildi!", "earned_points": earned_points, "progress": prog}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
