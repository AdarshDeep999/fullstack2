# 🚀 Experiment 5 – Lazy Loading in React (Vite)

## 📌 Objective
To implement Lazy Loading in React using `React.lazy()` and `Suspense` to improve performance and enable code splitting.

---

## 🛠 Technologies Used
- React
- Vite
- JavaScript (ES6)
- React.lazy()
- Suspense

---

## 📂 Project Structure

src/
├── components/
│ ├──dashboard
└── App.jsx

---

## ⚙️ Implementation Details

- Components are loaded dynamically using:
  ```js
  const MyProfile = lazy(() => import("./components/MyProfile"));

## 🖼️ Screenshots

### Dashboard
![Dashboard](./screenshots/dashboardd.png)

### Loading Page
![Loading Page](./screenshots/loading.png)

