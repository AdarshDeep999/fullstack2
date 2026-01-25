"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { SUBJECTS } from "@/lib/attendance-data";
import type { AttendanceInput } from "@/lib/optimizer";

interface AttendancePanelProps {
  attendance: Record<string, AttendanceInput>;
  onAttendanceChange: (code: string, value: AttendanceInput) => void;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function safeInt(n: unknown, fallback = 0) {
  const x = Number(n);
  if (!Number.isFinite(x)) return fallback;
  return Math.max(0, Math.floor(x));
}

function calcPercent(conducted: number, attended: number) {
  if (conducted <= 0) return 100;
  return clamp((attended / conducted) * 100, 0, 100);
}

export function AttendancePanel({ attendance, onAttendanceChange }: AttendancePanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-card rounded-2xl p-6 h-fit"
    >
      <h2 className="text-xl font-bold text-primary mb-2 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        Attendance Status
      </h2>

      <p className="text-xs text-muted-foreground mb-6">
        Enter <span className="text-foreground/90 font-medium">Conducted</span> +{" "}
        <span className="text-foreground/90 font-medium">Attended</span>. We calculate % automatically.
      </p>

      <div className="space-y-4">
        {SUBJECTS.map((subject, index) => {
          const current = attendance[subject.code] ?? { conducted: 0, attended: 0 };
          const conducted = safeInt(current.conducted);
          const attended = Math.min(safeInt(current.attended), conducted);

          const currentAttendance = calcPercent(conducted, attended);

          const isDanger = currentAttendance < subject.minAttendance;
          const buffer = currentAttendance - subject.minAttendance;

          return (
            <motion.div
              key={subject.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">
                      {subject.code}
                    </span>

                    {subject.minAttendance > 75 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        {subject.minAttendance}% MIN
                      </span>
                    )}

                    {subject.minAttendance === 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        OPTIONAL
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-foreground/90 truncate">
                    {subject.name}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {isDanger ? (
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  )}

                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded ${
                      isDanger
                        ? "bg-red-500/20 text-red-400"
                        : "bg-emerald-500/20 text-emerald-400"
                    }`}
                  >
                    {isDanger ? "DANGER" : "SAFE"}
                  </span>
                </div>
              </div>

              {/* Conducted + Attended Inputs */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-muted-foreground">Conducted</span>
                    <input
                      type="number"
                      min="0"
                      value={conducted}
                      onChange={(e) => {
                        const nextConducted = Math.max(0, Number(e.target.value) || 0);
                        const nextAttended = Math.min(attended, nextConducted);
                        onAttendanceChange(subject.code, {
                          conducted: nextConducted,
                          attended: nextAttended,
                        });
                      }}
                      className="w-20 h-9 text-center text-sm font-mono bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-muted-foreground">Attended</span>
                    <input
                      type="number"
                      min="0"
                      value={attended}
                      onChange={(e) => {
                        const nextAttended = Math.max(0, Number(e.target.value) || 0);
                        onAttendanceChange(subject.code, {
                          conducted,
                          attended: Math.min(nextAttended, conducted),
                        });
                      }}
                      className="w-20 h-9 text-center text-sm font-mono bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                    />
                  </div>
                </div>

                {/* Progress */}
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(100, currentAttendance)}%`,
                    }}
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

                <div className="w-16 text-right">
                  <div className="text-xs font-mono text-foreground/90">
                    {currentAttendance.toFixed(1)}%
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {buffer >= 0 ? `+${buffer.toFixed(1)}%` : `${buffer.toFixed(1)}%`}
                  </div>
                </div>
              </div>

              {/* Minimum threshold indicator */}
              {subject.minAttendance > 0 && (
                <div className="relative mt-1 h-1">
                  <div
                    className="absolute top-0 w-0.5 h-3 bg-muted-foreground/50 -translate-y-1"
                    style={{ left: `${subject.minAttendance}%` }}
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
