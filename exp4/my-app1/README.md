Experiment–1: Global State Management Using React Context API (Vite)
Aim

To implement global state management in a Single Page Application using the React Context API.

Software Requirements

Node.js

React

Vite

VS Code

Web Browser

Theory

In React applications, data is usually passed from parent to child using props. When multiple nested components require the same data, this leads to prop drilling, which makes the code complex and difficult to maintain.

The React Context API provides a way to share data globally across components without manually passing props at every level.

Main concepts used:

createContext() – Creates a Context object.

Provider – Supplies global data to child components.

useContext() – Consumes data from the Context.

Global State – Shared data accessible across multiple components.

Project Structure
src/
 ├── main.jsx
 ├── App.jsx
 ├── Home.jsx
 └── context/
      └── ThemeContext.jsx