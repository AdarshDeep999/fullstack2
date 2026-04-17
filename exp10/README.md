# 💬 WebSocket Chat App

A real-time chat application built with **Spring Boot** and **React** using WebSocket and STOMP protocol. Multiple users can chat simultaneously — messages appear instantly for everyone connected.

---

## 📸 Screenshots

### Chat 1 in Action
![Home](screenshots/exp10\screenshots\Screenshot 2026-04-17 150503.png)

### Chat 2 in Action
![Chat](screenshots/exp10\screenshots\Screenshot 2026-04-17 150512.png)

---

## 🚀 Getting Started

### Backend
1. Open the project in Eclipse
2. Navigate to `RestApiApplication.java`
3. Right-click → **Run As → Java Application**

Server runs at `http://localhost:8080`

### Frontend
```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`

---

## 💡 How It Works

1. User enters their name and connects
2. A WebSocket connection opens with the Spring Boot server at `/ws`
3. Messages sent to `/app/chat` are broadcast to all users via `/topic/messages`
4. Every connected user sees new messages instantly — no page refresh needed

---

## 🛠️ Tech Stack

| Layer     | Technology                            |
|-----------|---------------------------------------|
| Backend   | Java 21, Spring Boot, WebSocket, STOMP |
| Frontend  | React, Vite, SockJS, @stomp/stompjs   |
| Build Tool| Maven                                 |

---

## 📁 Project Structure
project-root/
├── backend/
│   └── src/main/java/com/AML3A/Demo_WebSocket/
├── frontend/
│   └── src/
│       └── components/
│           ├── Chat.jsx
│           ├── MessageInput.jsx
│           └── MessageList.jsx
└── screenshots/
├── home.png
└── chat.png

---

## 📦 Dependencies

**Frontend**
```bash
npm install sockjs-client @stomp/stompjs
```

**Backend** (Spring Initializr)
- Spring Web
- WebSocket
- Spring Boot DevTools

---

## ⚠️ Important Notes

- Make sure backend is running **before** opening the frontend
- `vite.config.js` must have `define: { global: 'globalThis' }` to avoid errors
- `main.jsx` must polyfill `Buffer` and `process` for SockJS to work in Vite

---

## 👨‍💻 Author

Made with ❤️ by **Adarsh**