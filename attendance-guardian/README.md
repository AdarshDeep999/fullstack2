# Attendance Guardian

Attendance Guardian is a **frontend-only attendance optimization tool** designed for college students.
It helps students decide **which classes to attend or skip** while **staying above mandatory attendance limits**, maximizing rest time, and reducing unnecessary campus hours.

The application runs entirely in the browser with **no backend**, and all data is stored locally.

---

## Features

### 1. Attendance-Aware Optimization

* Users enter **classes conducted** and **classes attended** for each subject.
* Attendance percentage is calculated automatically.
* The optimizer ensures attendance never falls below subject-specific minimum caps.

### 2. Subject-Specific Attendance Caps

Default caps:

* **75%** for most academic subjects
* **90%** for Soft Skills
* **0%** for Major Project (optional)

These rules are enforced during optimization.

### 3. Weekly Timetable Visualization

* Interactive weekly timetable
* Classes can be marked as **important** for the current week
* Important classes are always treated as mandatory

### 4. Rest-Optimized Scheduling

The optimizer:

* Prefers late entry or early exit from campus
* Tries to merge gaps into longer breaks
* Minimizes scattered idle time
* Balances risk based on selected mode

### 5. Risk Modes

* **Safe** – Never approaches attendance limits
* **Balanced** – Moderate flexibility
* **Aggressive** – Maximizes rest while staying barely above caps

### 6. 3D Classroom Interface

* Interactive classroom scene using Three.js
* Functional elements mapped to classroom objects:

  * Blackboard → Timetable
  * Teacher Desk → Attendance Input
  * Projector → Optimization Output
  * Door → Settings

### 7. Local-Only Data Storage

* All data is stored in `localStorage`
* No authentication
* No backend
* Fully private

---

## Tech Stack

* **Next.js 16 (App Router)**
* **React 19**
* **TypeScript**
* **Tailwind CSS**
* **Framer Motion**
* **Three.js**
* **@react-three/fiber**
* **@react-three/drei**
* **Lucide Icons**

---

## Project Structure

```
attendance-guardian/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── classroom-scene.tsx
│   ├── floating-panels.tsx
│   ├── attendance-panel.tsx
│   ├── timetable-board.tsx
│   ├── optimizer-controls.tsx
│   └── optimization-output.tsx
│
├── lib/
│   ├── attendance-data.ts
│   └── optimizer.ts
│
├── public/
├── package.json
└── README.md
```

---

## Installation & Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Run development server

```bash
npm run dev
```

### 3. Open in browser

```
http://localhost:3000
```

---

## How Attendance Calculation Works

For each subject:

```
attendance % = (attended / conducted) × 100
```

When a class is skipped:

* Conducted increases by 1
* Attended remains the same
* Optimizer checks if skipping violates the subject’s attendance cap

Only classes that keep attendance **above the cap** are marked flexible.

---

## Optimization Logic Summary

* Anchor classes:

  * Important classes
  * Classes that cannot be skipped without violating caps
* Flexible classes:

  * Skippable without violating attendance rules
* Weekly rest is calculated from:

  * Late entry
  * Early exit
  * Reduced mid-day gaps

---

## Limitations

* No backend or multi-user support
* Timetable is static (manual edits required for changes)
* Does not account for future extra classes or cancellations

---

## Intended Use

This project is intended for:

* Academic frontend projects
* UI/UX experimentation
* Personal attendance planning

It does **not** encourage violating institutional rules.

---

## License

This project is for educational use only.


