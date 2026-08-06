# 🧠 PsyMira – Mental Wellness Platform

![Status](https://img.shields.io/badge/status-In%20Development-blue)
![Version](https://img.shields.io/badge/version-1.0-orange)
![License](https://img.shields.io/badge/license-MIT-green)

PsyMira is a comprehensive mental wellness web application intended to help users develop healthy habits, monitor their mood, and practice self-care through interactive tools like breathing exercises, relaxation audio, journaling, and interactive story-based assessments.

Our goal is to make mental wellness more accessible by encouraging users to build positive daily routines, reflect on their emotions, and maintain a healthier lifestyle.

> **Disclaimer:** PsyMira is intended for self-care and mental wellness support. It is **not** a medical device and does **not** diagnose, treat, or replace professional mental health care.

---

## ✨ Features

### 😊 Mood Tracking
Track your daily emotions and understand how your mood changes over time.
- Daily mood logging, history, and calendar
- Weekly and monthly trends and statistics

### 😴 Sleep Tracking
Monitor your sleeping habits to build a healthier sleep routine.
- Sleep duration, quality, notes, and history

### 🌬️ Breathing Exercises
Reduce stress with guided breathing exercises.
- Box, 4-7-8, Deep, and Relaxation Breathing with animated guides

### 🧘 Meditation & 🎵 Relaxing Music
Practice mindfulness and listen to calming audio.
- Guided meditation, focus, sleep, and relaxation sessions
- Ambient sounds: Rain, Ocean, Forest, Fireplace, White/Brown Noise

### 📖 Story-Based Mental Health Assessment
Read interactive stories and answer scenario-based questions. Responses map to emotional traits (e.g., stillness, courage), provide insights into emotional well-being, and encourage self-reflection.

### 🎮 Stress Relief Games
Decompress with satisfying, web-based physics games.
- Sand Simulator for tactile, low-stakes relaxation

### 📝 Journal
Write about your thoughts and feelings every day.
- Daily journal entries, reflection notes, and mood-linked journals

### 📊 Dashboard & Analytics
Visualize your wellness journey with simple and informative charts.
- Mood/sleep trends, daily activity overview, wellness statistics, habit consistency

### 🏆 Habit & Streak System
Stay motivated by building healthy habits. Completing activities (like stories or breathing) earns XP and builds daily streaks.

---

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS, Framer Motion (animations)
- **Data Visualization:** Recharts
- **Backend/Database/Auth:** Supabase (PostgreSQL, Supabase Auth)
- **State Management:** React Context / Custom Hooks utilizing `localStorage` for offline-first data.

---

## 🏗️ Architecture & Implementation Details

1. **Authentication & User Profiles:** Uses `@supabase/ssr` and Supabase Auth. A Postgres trigger (`handle_new_user`) automatically creates a profile row to store user XP and streaks on signup.
2. **Dashboard & Analytics:** Analytics (mood trends, streaks, XP) are calculated on the client side using data stored in `localStorage` (`psymira.activity.v2`) for privacy and speed.
3. **Story-Based Assessment:** Choices map to emotional traits. Results are saved locally and synced to the `reflections` table in Supabase.
4. **Relaxation & Breathing:** State and audio logic are managed via local stores and hooks (e.g., `useRelaxationPlayer.ts`).

---

## 📁 Project Structure

```text
PsyMira
│
├── app                  # Next.js App Router (pages & routes)
│   ├── /auth, /dashboard, /breathing, /relaxation, /story, /sleep, /games
├── components           # Reusable React components by feature
├── lib                  # Core business logic, data models, state management
│   └── /supabase        # Supabase clients for SSR & client
├── supabase             # Supabase schema, triggers, and RLS policies
├── public               # Static assets
└── package.json         # Project dependencies
```

---

## ⚙️ Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Ahnaf-hasan-mahmud/PsyMira.git
   cd PsyMira
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env.local` file at the root of the project with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

---

## 🎯 Roadmap

- **Version 1.0:** User Auth, User Profile, Mood Tracker, Sleep Tracker, Journal, Breathing Exercises
- **Version 1.1:** Meditation Module, Relaxing Music, Interactive Story Assessment, Dashboard Improvements
- **Version 1.2:** Habit Tracker, Daily Challenges, Achievement System, Advanced Analytics
- **Future Plans:** Community Support, Wellness Resources, Mobile Application, Multi-language Support, Personalized Recommendations

---

## 🤝 Contributing

Contributions are welcome!
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m "Add new feature"`
4. Push your branch: `git push origin feature/new-feature`
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Authors

Developed with ❤️ by the **PsyMira Team**:
- **Dibya Das Gupta**
- **Ahnaf Hasan Mahmud**
- **Iftap Salim**

If you like this project, please consider giving it a **⭐ Star** on GitHub to support our mission of making mental wellness accessible for everyone.
