# PsyMira Project Context

**Overview**
PsyMira is a mental wellness web application intended to help users develop healthy habits, monitor their mood, and practice self-care through tools like breathing exercises, relaxation audio, journaling, and interactive story-based assessments.

**Important Note for AI Agents**
> **WARNING:** The `README.md` file contains outdated architectural information. It states the project uses a MERN stack (MongoDB, Express, React, Node.js). **This is incorrect for the current codebase.**
> 
> **The ACTUAL Tech Stack is:**
> - **Frontend/Framework:** Next.js 15 (App Router), React 18, TypeScript
> - **Styling:** Tailwind CSS, Framer Motion (for animations)
> - **Data Visualization:** Recharts
> - **Backend/Database/Auth:** Supabase (PostgreSQL, Supabase Auth)
> - **State Management:** React Context / Custom Hooks utilizing `localStorage` for offline-first data (e.g., `lib/activityStore.ts`).

---

## Directory Structure

The project follows a standard Next.js App Router structure:

- **`/app`**: Contains all the routes and pages of the application.
  - `/auth`, `/sign-in`, `/sign-up`: Authentication routes.
  - `/dashboard`: User dashboard displaying analytics, mood trends, and streaks.
  - `/breathing`: Guided breathing exercises.
  - `/relaxation`: Relaxation music/audio player.
  - `/story`: Interactive story-based mental health assessments.
- **`/components`**: Reusable React components grouped by feature (e.g., `charts`, `dashboard`, `illustrations`, `landing`, `relaxation`, `story`, `ui`).
- **`/lib`**: Core business logic, data models, state management, and custom hooks.
  - State stores (LocalStorage based): `activityStore.ts`, `diaryStore.ts`, `relaxationStore.ts`.
  - Content data: `assessmentData.ts`, `breathingData.ts`, `relaxationData.ts`, `storyData.ts`.
  - Database Client: `/lib/supabase/` for SSR and client Supabase instances.
- **`/supabase`**: Contains Supabase configuration and database schemas.
  - `schema.sql`: Contains the database schema (tables: `profiles`, `reflections`), Triggers, and Row Level Security (RLS) policies.

---

## Key Features & Implementation Details

1. **Authentication & User Profiles (`supabase/schema.sql`):**
   - Uses `@supabase/ssr` and Supabase Auth.
   - The `profiles` table stores user XP and streaks. It automatically inserts a row when a new user signs up via a Postgres trigger (`handle_new_user`).

2. **Dashboard & Analytics (`lib/activityStore.ts`):**
   - Analytics (mood trends, streaks, XP) are calculated on the client side using data stored in `localStorage` (`psymira.activity.v2`).
   - Completing a story or a breathing round earns the user XP and builds their daily streak.

3. **Story-Based Assessment (`app/story`, `lib/storyData.ts`):**
   - Users read interactive stories and make choices. Responses map to emotional traits (e.g., stillness, courage).
   - Results are saved locally and synced to the `reflections` table in Supabase.

4. **Relaxation & Breathing (`app/relaxation`, `app/breathing`):**
   - Provides audio and visual tools for relaxation. State and audio logic are managed via local stores and hooks (`useRelaxationPlayer.ts`).

## Guidelines for AI Agents Working on this Codebase
- Use **Next.js App Router** conventions. Distinguish between Server Components (default) and Client Components (requires `"use client"` directive).
- Use **Tailwind CSS** for styling and **Framer Motion** for UI animations.
- Check the `lib/` folder for existing data structures or stores before creating new state management systems.
- When modifying backend logic, remember that a significant portion of user activity (like daily moods and diary entries) is designed to work client-side via `localStorage` for privacy and speed, while only specific data (like profiles and reflections) sync to Supabase.
