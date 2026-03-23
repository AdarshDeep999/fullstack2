"use client";

import React from "react"

import { motion } from "framer-motion";
import { Sliders, AlertCircle, Star, Sparkles } from "lucide-react";
import { SUBJECTS } from "@/lib/attendance-data";

interface OptimizerControlsProps {
  maxFlexible: number;
  onMaxFlexibleChange: (value: number) => void;
  riskMode: number;
  onRiskModeChange: (value: number) => void;
  importantCount: number;
  riskyCount: number;
  flexibleCount: number;
  attendance: Record<string, number>;
}

export function OptimizerControls({
  maxFlexible,
  onMaxFlexibleChange,
  riskMode,
  onRiskModeChange,
  importantCount,
  riskyCount,
  flexibleCount,
  attendance,
}: OptimizerControlsProps) {
  // Calculate risky subjects count
  const riskySubjects = SUBJECTS.filter((s) => {
    const att = attendance[s.code] ?? 75;
    return att < s.minAttendance;
  }).length;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="glass-card rounded-2xl p-6"
    >
      <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
        <Sliders className="w-5 h-5" />
        Optimizer Controls
      </h2>

      {/* Sliders */}
      <div className="space-y-6 mb-8">
        {/* Max Flexible Slider */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-foreground/90">
              Max Flexible Classes per Week
            </label>
            <span className="text-lg font-bold text-primary font-mono">
              {maxFlexible}
            </span>
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
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:transition-all
              [&::-webkit-slider-thumb]:hover:scale-110
              [&::-moz-range-thumb]:w-5
              [&::-moz-range-thumb]:h-5
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-primary
              [&::-moz-range-thumb]:border-0
              [&::-moz-range-thumb]:cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0 (Conservative)</span>
            <span>12 (Maximum)</span>
          </div>
        </div>

        {/* Risk Mode Slider */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-foreground/90">
              Risk Mode
            </label>
            <span
              className={`text-sm font-semibold px-2 py-0.5 rounded ${
                riskMode < 30
                  ? "bg-emerald-500/20 text-emerald-400"
                  : riskMode < 70
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-red-500/20 text-red-400"
              }`}
            >
              {riskMode < 30 ? "Safe" : riskMode < 70 ? "Balanced" : "Aggressive"}
            </span>
          </div>
          <div className="relative">
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
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:transition-all
                [&::-webkit-slider-thumb]:hover:scale-110
                [&::-moz-range-thumb]:w-5
                [&::-moz-range-thumb]:h-5
                [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-foreground
                [&::-moz-range-thumb]:border-0
                [&::-moz-range-thumb]:cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Safe</span>
            <span>Aggressive</span>
          </div>
        </div>
      </div>

      {/* Stats counters */}
      <div className="grid grid-cols-3 gap-3">
        <StatCounter
          icon={<Star className="w-4 h-4" />}
          label="Important"
          value={importantCount}
          color="pink"
        />
        <StatCounter
          icon={<AlertCircle className="w-4 h-4" />}
          label="Risky Subjects"
          value={riskySubjects}
          color="red"
        />
        <StatCounter
          icon={<Sparkles className="w-4 h-4" />}
          label="Flexible"
          value={flexibleCount}
          color="amber"
        />
      </div>
    </motion.div>
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
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-3 text-center`}
    >
      <div className="flex items-center justify-center gap-1 mb-1">{icon}</div>
      <div className="text-2xl font-bold font-mono">{value}</div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </motion.div>
  );
}
