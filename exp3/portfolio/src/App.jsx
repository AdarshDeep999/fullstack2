import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
import Skills from "./pages/Skills";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Profile />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/skills" element={<Skills />} />
      </Routes>
    </>
  );
}
