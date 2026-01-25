"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, HelpCircle, Eye } from "lucide-react";
import dynamic from "next/dynamic";
import { SUBJECTS } from "@/lib/attendance-data";
import { runOptimizer, OptimizationResult } from "@/lib/optimizer";
import {
  TimetablePanel,
  AttendancePanelFloating,
  OptimizationPanel,
  SettingsPanel,
} from "@/components/floating-panels";
import { PanelType } from "@/components/classroom-scene";

// Dynamically import 3D scene to avoid SSR issues
const ClassroomScene = dynamic(
  () => import("@/components/classroom-scene").then((mod) => mod.ClassroomScene),
  { ssr: false }
);

// LocalStorage keys
const STORAGE_KEYS = {
  attendance: "attendance-guardian-attendance",
  important: "attendance-guardian-important",
  maxFlexible: "attendance-guardian-max-flexible",
  riskMode: "attendance-guardian-risk-mode",
};

// Default attendance values
const getDefaultAttendance = (): Record<string, number> => {
  const defaults: Record<string, number> = {};
  for (const subject of SUBJECTS) {
    defaults[subject.code] = 75;
  }
  return defaults;
};

export default function AttendanceGuardian() {
  // State
  const [attendance, setAttendance] = useState<Record<string, number>>(getDefaultAttendance);
  const [importantClasses, setImportantClasses] = useState<Set<string>>(new Set());
  const [maxFlexible, setMaxFlexible] = useState(4);
  const [riskMode, setRiskMode] = useState(30);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activePanel, setActivePanel] = useState<PanelType>(null);
  const [showHelp, setShowHelp] = useState(true);

  // Load from localStorage
  useEffect(() => {
    try {
      const savedAttendance = localStorage.getItem(STORAGE_KEYS.attendance);
      const savedImportant = localStorage.getItem(STORAGE_KEYS.important);
      const savedMaxFlexible = localStorage.getItem(STORAGE_KEYS.maxFlexible);
      const savedRiskMode = localStorage.getItem(STORAGE_KEYS.riskMode);

      if (savedAttendance) {
        setAttendance(JSON.parse(savedAttendance));
      }
      if (savedImportant) {
        setImportantClasses(new Set(JSON.parse(savedImportant)));
      }
      if (savedMaxFlexible) {
        setMaxFlexible(Number(savedMaxFlexible));
      }
      if (savedRiskMode) {
        setRiskMode(Number(savedRiskMode));
      }
    } catch (e) {
      console.error("Failed to load from localStorage:", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.attendance, JSON.stringify(attendance));
      localStorage.setItem(STORAGE_KEYS.important, JSON.stringify([...importantClasses]));
      localStorage.setItem(STORAGE_KEYS.maxFlexible, String(maxFlexible));
      localStorage.setItem(STORAGE_KEYS.riskMode, String(riskMode));
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
    }
  }, [attendance, importantClasses, maxFlexible, riskMode, isLoaded]);

  // Run optimizer
  const optimizationResults = useMemo<OptimizationResult[]>(() => {
    return runOptimizer({
      attendance,
      importantClasses,
      maxFlexible,
      riskMode,
    });
  }, [attendance, importantClasses, maxFlexible, riskMode]);

  // Calculate stats
  const flexibleCount = optimizationResults.reduce(
    (sum, r) => sum + r.flexibleClasses.length,
    0
  );
  const riskyCount = SUBJECTS.filter((s) => {
    const att = attendance[s.code] ?? 75;
    return att < s.minAttendance;
  }).length;

  // Handlers
  const handleAttendanceChange = (code: string, value: number) => {
    setAttendance((prev) => ({ ...prev, [code]: value }));
  };

  const handleToggleImportant = (key: string) => {
    setImportantClasses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const handleReset = () => {
    setAttendance(getDefaultAttendance());
    setImportantClasses(new Set());
    setMaxFlexible(4);
    setRiskMode(30);
    setActivePanel(null);
  };

  const handleResetView = () => {
    setActivePanel(null);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading classroom...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* 3D Classroom Scene */}
      <ClassroomScene activePanel={activePanel} onPanelChange={setActivePanel} />

      {/* Gradient overlay for better UI contrast */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-t from-background/40 via-transparent to-background/20 z-10" />

      {/* Top HUD */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/50 flex items-center justify-center">
              <span className="text-primary font-bold text-lg">A</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary neon-text">Attendance Guardian</h1>
              <p className="text-[10px] text-muted-foreground">Optimize your week</p>
            </div>
          </motion.div>

          {/* Control buttons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <button
              onClick={() => setShowHelp(!showHelp)}
              className={`p-2.5 rounded-xl glass-card border transition-all duration-300 ${
                showHelp ? "border-primary/50 text-primary" : "border-border/50 text-muted-foreground hover:border-primary/30"
              }`}
              title="Toggle help"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button
              onClick={handleResetView}
              className="p-2.5 rounded-xl glass-card border border-border/50 text-muted-foreground hover:border-primary/30 hover:text-primary transition-all duration-300"
              title="Reset camera view"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={handleReset}
              className="p-2.5 rounded-xl glass-card border border-border/50 text-muted-foreground hover:border-destructive/50 hover:text-destructive transition-all duration-300"
              title="Reset all data"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </header>

      {/* Help instruction overlay */}
      <AnimatePresence>
        {showHelp && !activePanel && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30"
          >
            <div className="glass-card rounded-2xl px-6 py-4 border border-primary/30">
              <p className="text-center text-sm text-foreground/90 mb-3">
                Click on objects to interact with the classroom
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <HelpItem icon="board" label="Blackboard" description="Timetable" />
                <HelpItem icon="desk" label="Teacher Desk" description="Attendance" />
                <HelpItem icon="projector" label="Projector" description="Weekly Plan" />
                <HelpItem icon="door" label="Door" description="Settings" />
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="mt-3 w-full text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Click to dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Panels */}
      <TimetablePanel
        isOpen={activePanel === "blackboard"}
        onClose={() => setActivePanel(null)}
        importantClasses={importantClasses}
        onToggleImportant={handleToggleImportant}
        attendance={attendance}
        optimizationResults={optimizationResults}
      />

      <AttendancePanelFloating
        isOpen={activePanel === "desk"}
        onClose={() => setActivePanel(null)}
        attendance={attendance}
        onAttendanceChange={handleAttendanceChange}
      />

      <OptimizationPanel
        isOpen={activePanel === "projector"}
        onClose={() => setActivePanel(null)}
        results={optimizationResults}
      />

      <SettingsPanel
        isOpen={activePanel === "door"}
        onClose={() => setActivePanel(null)}
        maxFlexible={maxFlexible}
        onMaxFlexibleChange={setMaxFlexible}
        riskMode={riskMode}
        onRiskModeChange={setRiskMode}
        importantCount={importantClasses.size}
        riskyCount={riskyCount}
        flexibleCount={flexibleCount}
      />

      {/* Footer attribution */}
      <footer className="fixed bottom-2 right-4 z-20">
        <p className="text-[10px] text-muted-foreground/50">
          Data persisted locally
        </p>
      </footer>
    </div>
  );
}

function HelpItem({ icon, label, description }: { icon: string; label: string; description: string }) {
  const iconColors: Record<string, string> = {
    board: "text-cyan-400",
    desk: "text-emerald-400",
    projector: "text-blue-400",
    door: "text-red-400",
  };

  const iconEmoji: Record<string, string> = {
    board: "B",
    desk: "D",
    projector: "P",
    door: "S",
  };

  return (
    <div className="flex items-center gap-2 bg-secondary/30 rounded-lg px-3 py-2">
      <span className={`w-6 h-6 rounded flex items-center justify-center bg-secondary text-xs font-bold ${iconColors[icon]}`}>
        {iconEmoji[icon]}
      </span>
      <div>
        <div className="font-medium text-foreground/90">{label}</div>
        <div className="text-muted-foreground text-[10px]">{description}</div>
      </div>
    </div>
  );
}
