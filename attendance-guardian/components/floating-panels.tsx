"use client";

import React from "react"

import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, CheckCircle, Clock, LogIn, LogOut, Coffee, CheckCircle2, CircleDashed, Sliders, AlertCircle, Star, Sparkles } from "lucide-react";
import { SUBJECTS, DAYS, TIME_SLOTS, TIMETABLE, getSubjectByCode, getClassTypeLabel, getClassBlockKey, Day, ClassBlock } from "@/lib/attendance-data";
import { OptimizationResult, formatMinutes } from "@/lib/optimizer";
import { PanelType } from "./classroom-scene";

interface FloatingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  position?: "left" | "center" | "right";
  accentColor?: string;
}

function FloatingPanel({ isOpen, onClose, children, title, position = "center", accentColor = "primary" }: FloatingPanelProps) {
  const positionClasses = {
    left: "left-4 md:left-8",
    center: "left-1/2 -translate-x-1/2",
    right: "right-4 md:right-8",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`fixed top-20 ${positionClasses[position]} z-40 w-[90vw] max-w-md md:max-w-lg lg:max-w-xl max-h-[75vh] overflow-hidden`}
        >
          <div className="glass-card rounded-2xl border border-primary/30 overflow-hidden">
            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b border-border/30 bg-gradient-to-r from-${accentColor}/10 to-transparent`}>
              <h2 className={`text-lg font-bold text-${accentColor} flex items-center gap-2`}>
                <span className={`w-2 h-2 rounded-full bg-${accentColor} animate-pulse`} />
                {title}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-4 md:p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
              {children}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Timetable Panel (Blackboard)
interface TimetablePanelProps {
  isOpen: boolean;
  onClose: () => void;
  importantClasses: Set<string>;
  onToggleImportant: (key: string) => void;
  attendance: Record<string, number>;
  optimizationResults: OptimizationResult[];
}

export function TimetablePanel({
  isOpen,
  onClose,
  importantClasses,
  onToggleImportant,
  attendance,
  optimizationResults,
}: TimetablePanelProps) {
  const getOptimizationForDay = (day: Day) =>
    optimizationResults.find((r) => r.day === day);

  const isAnchor = (day: Day, slotIndex: number) => {
    const result = getOptimizationForDay(day);
    if (!result) return false;
    return result.anchorClasses.some((c) => c.slotIndex === slotIndex);
  };

  const isFlexible = (day: Day, slotIndex: number) => {
    const result = getOptimizationForDay(day);
    if (!result) return false;
    return result.flexibleClasses.some((c) => c.slotIndex === slotIndex);
  };

  return (
    <FloatingPanel isOpen={isOpen} onClose={onClose} title="Weekly Timetable" position="center">
      <div className="overflow-x-auto -mx-2">
        {/* Grid header */}
        <div className="grid grid-cols-[60px_repeat(5,1fr)] gap-1 mb-2 min-w-[600px] px-2">
          <div className="text-[10px] text-muted-foreground font-medium p-1">TIME</div>
          {DAYS.map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-primary p-1">
              {day}
            </div>
          ))}
        </div>

        {/* Time slots */}
        <div className="space-y-1 min-w-[600px] px-2">
          {TIME_SLOTS.map((slot, slotIndex) => (
            <div key={slot.label} className="grid grid-cols-[60px_repeat(5,1fr)] gap-1">
              <div className="text-[9px] text-muted-foreground font-mono p-1 flex items-center">
                {slot.start}
              </div>
              {DAYS.map((day) => {
                const block = TIMETABLE[day][slotIndex];
                if (!block) {
                  return (
                    <div
                      key={`${day}-${slotIndex}`}
                      className="h-14 rounded bg-secondary/20 border border-dashed border-border/30 flex items-center justify-center"
                    >
                      <span className="text-[8px] text-muted-foreground/50">FREE</span>
                    </div>
                  );
                }

                const subject = getSubjectByCode(block.subjectCode);
                const key = getClassBlockKey(block);
                const isImportant = importantClasses.has(key);
                const isDanger = (attendance[block.subjectCode] ?? 75) < (subject?.minAttendance ?? 75);
                const anchor = isAnchor(day, slotIndex);
                const flexible = isFlexible(day, slotIndex);

                let borderColor = "border-border/50";
                let bgColor = "bg-secondary/30";
                if (isImportant) {
                  borderColor = "border-pink-500/60";
                  bgColor = "bg-pink-500/10";
                } else if (isDanger) {
                  borderColor = "border-red-500/60";
                  bgColor = "bg-red-500/10";
                } else if (anchor) {
                  borderColor = "border-cyan-500/60";
                  bgColor = "bg-cyan-500/10";
                } else if (flexible) {
                  borderColor = "border-amber-500/60";
                  bgColor = "bg-amber-500/10";
                }

                return (
                  <button
                    key={key}
                    onClick={() => onToggleImportant(key)}
                    className={`h-14 rounded p-1 text-left transition-all border ${borderColor} ${bgColor} hover:scale-[1.02] hover:border-primary/50`}
                  >
                    <div className="text-[8px] font-mono text-muted-foreground truncate">
                      {block.subjectCode.split("-")[1]}
                    </div>
                    <div className="text-[9px] text-foreground/80 line-clamp-2 leading-tight">
                      {subject?.name.slice(0, 15)}...
                    </div>
                    <div className="flex gap-0.5 mt-0.5">
                      <span className={`text-[7px] px-1 rounded ${
                        block.type === "L" ? "bg-blue-500/30 text-blue-300" :
                        block.type === "P" ? "bg-emerald-500/30 text-emerald-300" :
                        "bg-purple-500/30 text-purple-300"
                      }`}>
                        {block.type}
                      </span>
                      {isImportant && <span className="text-[7px] px-1 rounded bg-pink-500/30 text-pink-300">IMP</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-border/30 px-2">
          <LegendItem color="cyan" label="Anchor" />
          <LegendItem color="amber" label="Flexible" />
          <LegendItem color="pink" label="Important" />
          <LegendItem color="red" label="Danger" />
        </div>
      </div>
    </FloatingPanel>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  const colorClasses: Record<string, string> = {
    cyan: "bg-cyan-500",
    amber: "bg-amber-500",
    pink: "bg-pink-500",
    red: "bg-red-500",
  };
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2 h-2 rounded ${colorClasses[color]}`} />
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  );
}

// Attendance Panel (Teacher Desk)
interface AttendancePanelFloatingProps {
  isOpen: boolean;
  onClose: () => void;
  attendance: Record<string, number>;
  onAttendanceChange: (code: string, value: number) => void;
}

export function AttendancePanelFloating({
  isOpen,
  onClose,
  attendance,
  onAttendanceChange,
}: AttendancePanelFloatingProps) {
  return (
    <FloatingPanel isOpen={isOpen} onClose={onClose} title="Attendance Input" position="left" accentColor="accent">
      <div className="space-y-3">
        {SUBJECTS.map((subject) => {
          const currentAttendance = attendance[subject.code] ?? 75;
          const isDanger = currentAttendance < subject.minAttendance;
          const buffer = currentAttendance - subject.minAttendance;

          return (
            <motion.div
              key={subject.code}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="group"
            >
              <div className="flex items-start justify-between mb-1.5">
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {subject.code}
                    </span>
                    {subject.minAttendance > 75 && (
                      <span className="text-[8px] px-1 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        {subject.minAttendance}%
                      </span>
                    )}
                    {subject.minAttendance === 0 && (
                      <span className="text-[8px] px-1 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        OPT
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-foreground/90 truncate">{subject.name}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  {isDanger ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  ) : (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={currentAttendance}
                    onChange={(e) => {
                      const val = Math.min(100, Math.max(0, Number(e.target.value) || 0));
                      onAttendanceChange(subject.code, val);
                    }}
                    className="w-14 h-8 text-center text-xs font-mono bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                  />
                  <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground">%</span>
                </div>

                <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, currentAttendance)}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`h-full rounded-full ${
                      isDanger
                        ? "bg-gradient-to-r from-red-500 to-red-400"
                        : buffer > 10
                          ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                          : "bg-gradient-to-r from-amber-500 to-amber-400"
                    }`}
                  />
                </div>

                <span className={`text-[10px] w-10 text-right ${buffer >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {buffer >= 0 ? `+${buffer}%` : `${buffer}%`}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </FloatingPanel>
  );
}

// Optimization Output Panel (Projector)
interface OptimizationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  results: OptimizationResult[];
}

export function OptimizationPanel({ isOpen, onClose, results }: OptimizationPanelProps) {
  const totalRestGain = results.reduce((sum, r) => sum + r.restGainMinutes, 0);

  return (
    <FloatingPanel isOpen={isOpen} onClose={onClose} title="Week Optimization" position="right">
      {/* Total rest gain */}
      <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-3 py-2 rounded-lg border border-emerald-500/30 mb-4">
        <Coffee className="w-4 h-4" />
        <span className="text-sm font-semibold">+{formatMinutes(totalRestGain)} Rest Gained This Week</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {results.map((result, index) => (
          <motion.div
            key={result.day}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-secondary/30 border border-border/50 rounded-xl p-3"
          >
            <div className="text-center mb-2">
              <h3 className="text-sm font-bold text-primary">{result.day}</h3>
            </div>

            <div className="space-y-1.5 mb-3">
              <div className="flex items-center gap-1.5">
                <LogIn className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] text-muted-foreground">Entry:</span>
                <span className="text-xs font-mono font-semibold text-foreground/90 ml-auto">
                  {result.entryTime}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <LogOut className="w-3 h-3 text-amber-400" />
                <span className="text-[10px] text-muted-foreground">Exit:</span>
                <span className="text-xs font-mono font-semibold text-foreground/90 ml-auto">
                  {result.exitTime}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Coffee className="w-3 h-3 text-cyan-400" />
                <span className="text-[10px] text-muted-foreground">Rest:</span>
                <span className="text-xs font-mono font-semibold text-emerald-400 ml-auto">
                  +{formatMinutes(result.restGainMinutes)}
                </span>
              </div>
            </div>

            <div className="flex gap-2 text-[9px]">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5 text-cyan-400" />
                <span className="text-cyan-400">{result.anchorClasses.length} Anchor</span>
              </div>
              <div className="flex items-center gap-1">
                <CircleDashed className="w-2.5 h-2.5 text-amber-400" />
                <span className="text-amber-400">{result.flexibleClasses.length} Flex</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </FloatingPanel>
  );
}

// Settings Panel (Door)
interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  maxFlexible: number;
  onMaxFlexibleChange: (value: number) => void;
  riskMode: number;
  onRiskModeChange: (value: number) => void;
  importantCount: number;
  riskyCount: number;
  flexibleCount: number;
}

export function SettingsPanel({
  isOpen,
  onClose,
  maxFlexible,
  onMaxFlexibleChange,
  riskMode,
  onRiskModeChange,
  importantCount,
  riskyCount,
  flexibleCount,
}: SettingsPanelProps) {
  return (
    <FloatingPanel isOpen={isOpen} onClose={onClose} title="Settings" position="right" accentColor="destructive">
      <div className="space-y-6">
        {/* Max Flexible Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-foreground/90">
              Max Flexible Classes / Week
            </label>
            <span className="text-lg font-bold text-primary font-mono">{maxFlexible}</span>
          </div>
          <input
            type="range"
            min="0"
            max="12"
            value={maxFlexible}
            onChange={(e) => onMaxFlexibleChange(Number(e.target.value))}
            className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-5
              [&::-webkit-slider-thumb]:h-5
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-primary
              [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(0,220,255,0.5)]
              [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>0 (Conservative)</span>
            <span>12 (Maximum)</span>
          </div>
        </div>

        {/* Risk Mode Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-foreground/90">Risk Mode</label>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
              riskMode < 30 ? "bg-emerald-500/20 text-emerald-400" :
              riskMode < 70 ? "bg-amber-500/20 text-amber-400" :
              "bg-red-500/20 text-red-400"
            }`}>
              {riskMode < 30 ? "Safe" : riskMode < 70 ? "Balanced" : "Aggressive"}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={riskMode}
            onChange={(e) => onRiskModeChange(Number(e.target.value))}
            className="w-full h-2 bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-5
              [&::-webkit-slider-thumb]:h-5
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-foreground
              [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(255,255,255,0.3)]
              [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>Safe</span>
            <span>Aggressive</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border/30">
          <StatCounter icon={<Star className="w-3.5 h-3.5" />} label="Important" value={importantCount} color="pink" />
          <StatCounter icon={<AlertCircle className="w-3.5 h-3.5" />} label="Risky" value={riskyCount} color="red" />
          <StatCounter icon={<Sparkles className="w-3.5 h-3.5" />} label="Flexible" value={flexibleCount} color="amber" />
        </div>
      </div>
    </FloatingPanel>
  );
}

interface StatCounterProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "pink" | "red" | "amber";
}

function StatCounter({ icon, label, value, color }: StatCounterProps) {
  const colorClasses = {
    pink: "from-pink-500/20 to-pink-500/5 border-pink-500/30 text-pink-400",
    red: "from-red-500/20 to-red-500/5 border-red-500/30 text-red-400",
    amber: "from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-400",
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-lg p-2 text-center`}>
      <div className="flex items-center justify-center mb-0.5">{icon}</div>
      <div className="text-lg font-bold font-mono">{value}</div>
      <div className="text-[9px] text-muted-foreground">{label}</div>
    </div>
  );
}
