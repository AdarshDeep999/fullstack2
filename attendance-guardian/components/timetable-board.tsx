"use client";

import { motion } from "framer-motion";
import {
  DAYS,
  TIME_SLOTS,
  TIMETABLE,
  getSubjectByCode,
  getClassTypeLabel,
  getClassBlockKey,
  Day,
  ClassBlock,
} from "@/lib/attendance-data";
import { OptimizationResult } from "@/lib/optimizer";

interface TimetableBoardProps {
  importantClasses: Set<string>;
  onToggleImportant: (key: string) => void;
  attendance: Record<string, number>;
  optimizationResults: OptimizationResult[];
}

export function TimetableBoard({
  importantClasses,
  onToggleImportant,
  attendance,
  optimizationResults,
}: TimetableBoardProps) {
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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative"
    >
      {/* Projector beam effect */}
      <div className="projector-beam">
        <div className="hologram rounded-2xl p-6 overflow-x-auto">
          {/* Scanline effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-20 animate-[scanline_4s_linear_infinite]" />
          </div>

          <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            Weekly Timetable
            <span className="text-sm font-normal text-muted-foreground ml-2">
              (Click to mark important)
            </span>
          </h2>

          {/* Grid header */}
          <div className="grid grid-cols-[100px_repeat(5,1fr)] gap-2 mb-2">
            <div className="text-xs text-muted-foreground font-medium p-2">
              TIME
            </div>
            {DAYS.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-semibold text-primary p-2"
              >
                {day.toUpperCase()}
              </div>
            ))}
          </div>

          {/* Time slots */}
          <div className="space-y-2">
            {TIME_SLOTS.map((slot, slotIndex) => (
              <div
                key={slot.label}
                className="grid grid-cols-[100px_repeat(5,1fr)] gap-2"
              >
                <div className="text-xs text-muted-foreground font-mono p-2 flex items-center">
                  {slot.label}
                </div>
                {DAYS.map((day) => {
                  const block = TIMETABLE[day][slotIndex];
                  if (!block) {
                    return (
                      <div
                        key={`${day}-${slotIndex}`}
                        className="min-h-[80px] rounded-lg bg-secondary/20 border border-dashed border-border/30 flex items-center justify-center"
                      >
                        <span className="text-xs text-muted-foreground/50">
                          FREE
                        </span>
                      </div>
                    );
                  }

                  return (
                    <ClassCell
                      key={getClassBlockKey(block)}
                      block={block}
                      isImportant={importantClasses.has(getClassBlockKey(block))}
                      isAnchor={isAnchor(day, slotIndex)}
                      isFlexible={isFlexible(day, slotIndex)}
                      attendance={attendance[block.subjectCode] ?? 75}
                      onToggle={() =>
                        onToggleImportant(getClassBlockKey(block))
                      }
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-border/30">
            <LegendItem color="cyan" label="Anchor (Must Attend)" />
            <LegendItem color="amber" label="Flexible (Optional)" />
            <LegendItem color="pink" label="Important (Marked)" />
            <LegendItem color="red" label="Danger (Low Attendance)" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface ClassCellProps {
  block: ClassBlock;
  isImportant: boolean;
  isAnchor: boolean;
  isFlexible: boolean;
  attendance: number;
  onToggle: () => void;
}

function ClassCell({
  block,
  isImportant,
  isAnchor,
  isFlexible,
  attendance,
  onToggle,
}: ClassCellProps) {
  const subject = getSubjectByCode(block.subjectCode);
  if (!subject) return null;

  const isDanger = attendance < subject.minAttendance;
  const isMajorProject = block.subjectCode === "23CSR-399";

  // Determine cell styling
  let borderColor = "border-border/50";
  let bgColor = "bg-secondary/30";
  let glowClass = "";

  if (isImportant) {
    borderColor = "border-pink-500/60";
    bgColor = "bg-pink-500/10";
    glowClass = "shadow-[0_0_15px_rgba(236,72,153,0.3)]";
  } else if (isDanger) {
    borderColor = "border-red-500/60";
    bgColor = "bg-red-500/10";
  } else if (isAnchor) {
    borderColor = "border-cyan-500/60";
    bgColor = "bg-cyan-500/10";
    glowClass = "shadow-[0_0_15px_rgba(0,220,255,0.2)]";
  } else if (isFlexible) {
    borderColor = "border-amber-500/60";
    bgColor = "bg-amber-500/10";
  }

  return (
    <motion.button
      onClick={onToggle}
      whileHover={{
        scale: 1.02,
        rotateX: 5,
        rotateY: -5,
      }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative min-h-[80px] rounded-lg p-3 cursor-pointer transition-all duration-300
        border ${borderColor} ${bgColor} ${glowClass}
        hover:shadow-lg hover:border-primary/50
        perspective-1000 transform-gpu
      `}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Type badge */}
      <div className="absolute top-2 right-2">
        <span
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
            block.type === "L"
              ? "bg-blue-500/20 text-blue-400"
              : block.type === "P"
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-purple-500/20 text-purple-400"
          }`}
        >
          {block.type}
        </span>
      </div>

      {/* Content */}
      <div className="text-left">
        <div className="text-[11px] font-mono text-muted-foreground mb-1 truncate">
          {block.subjectCode}
        </div>
        <div className="text-xs font-medium text-foreground/90 line-clamp-2 leading-tight">
          {subject.name}
        </div>
        <div className="text-[10px] text-muted-foreground mt-1">
          {getClassTypeLabel(block.type)}
        </div>
      </div>

      {/* Status indicators */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1">
        {isImportant && (
          <span className="text-[9px] px-1 py-0.5 rounded bg-pink-500/30 text-pink-300">
            IMPORTANT
          </span>
        )}
        {isDanger && !isImportant && (
          <span className="text-[9px] px-1 py-0.5 rounded bg-red-500/30 text-red-300">
            DANGER
          </span>
        )}
        {isMajorProject && (
          <span className="text-[9px] px-1 py-0.5 rounded bg-emerald-500/30 text-emerald-300">
            PROJECT
          </span>
        )}
      </div>
    </motion.button>
  );
}

interface LegendItemProps {
  color: "cyan" | "amber" | "pink" | "red";
  label: string;
}

function LegendItem({ color, label }: LegendItemProps) {
  const colorClasses = {
    cyan: "bg-cyan-500",
    amber: "bg-amber-500",
    pink: "bg-pink-500",
    red: "bg-red-500",
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded ${colorClasses[color]}`} />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
