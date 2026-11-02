# 🎓 Ortaokul & LGS Sınav Hazırlık Uygulaması

Ortaokul öğrencileri (5, 6, 7 ve 8. Sınıf / LGS) için tasarlanmış, soru çözme, deneme sınavı, konu özetleri ve oyunlaştırma (puan, rozet) özelliklerine sahip interaktif sınav hazırlık platformu.

---

## 🚀 Hızlı Başlatma (Tek Tıkla)

Klasörün içindeki **`BASLAT.cmd`** dosyasına çift tıklayarak hem backend'i hem frontend'i aynı anda başlatabilirsin! Tarayıcın otomatik olarak açılacaktır.

---

## 🛠️ Manuel Başlatma

### 1. Backend (Python + FastAPI)
```bash
cd backend
.\venv\Scripts\activate
python -m uvicorn main:app --reload --port 8000
```
- API Dokümantasyonu (Swagger): `http://127.0.0.1:8000/docs`

### 2. Frontend (React + Vite + Tailwind CSS)
```bash
cd frontend
npm run dev
```
- Uygulama Ekranı: `http://localhost:5173`

---

## 🌟 Öne Çıkan Özellikler

- **🎯 Sınıf & Ders Seçimi:** 5, 6, 7 ve 8. sınıf (Matematik, Fen, Türkçe, Sosyal, İngilizce, Din).
- **⏱️ Sınav & Alıştırma Modları:** 
  - **Alıştırma Modu:** Anında doğru/yanlış gösterimi, konfeti tebriği ve ayrıntılı çözüm ipuçları.
  - **Süreli Deneme Modu:** Süre sayacı, gerçek sınav deneyimi ve detaylı karne.
- **🏆 Oyunlaştırma & Rozetler:** Puan kazanma, "Matematik Dahisi", "LGS Fatihi", "Soru Avcısı" rozetleri.
- **📖 Pratik Konu Özetleri:** Sınav öncesi hızlı tekrar için püf nokta kartları.
- **💾 Kalıcı İlerleme:** Çözülen sorular, puanlar ve sınav geçmişi kaydedilir.
