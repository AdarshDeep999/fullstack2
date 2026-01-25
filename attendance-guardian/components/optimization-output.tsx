"use client";

import { motion } from "framer-motion";
import {
  Clock,
  LogIn,
  LogOut,
  Coffee,
  CheckCircle2,
  CircleDashed,
} from "lucide-react";
import { OptimizationResult, formatMinutes } from "@/lib/optimizer";
import { getSubjectByCode, TIME_SLOTS } from "@/lib/attendance-data";

interface OptimizationOutputProps {
  results: OptimizationResult[];
}

export function OptimizationOutput({ results }: OptimizationOutputProps) {
  const totalRestGain = results.reduce((sum, r) => sum + r.restGainMinutes, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Week Optimization
        </h2>
        <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/30">
          <Coffee className="w-4 h-4" />
          <span className="text-sm font-semibold">
            +{formatMinutes(totalRestGain)} Rest Gained
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {results.map((result, index) => (
          <DayCard key={result.day} result={result} index={index} />
        ))}
      </div>
    </motion.div>
  );
}

interface DayCardProps {
  result: OptimizationResult;
  index: number;
}

function DayCard({ result, index }: DayCardProps) {
  const hasClasses = result.anchorClasses.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-gradient-to-br from-secondary/50 to-secondary/20 border border-border/50 rounded-xl p-4 hover:border-primary/30 transition-all duration-300"
    >
      {/* Day header */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-primary">{result.day}</h3>
        <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto mt-2" />
      </div>

      {/* Times */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2">
          <LogIn className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-muted-foreground">Entry:</span>
          <span className="text-sm font-mono font-semibold text-foreground/90 ml-auto">
            {result.entryTime}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <LogOut className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-muted-foreground">Exit:</span>
          <span className="text-sm font-mono font-semibold text-foreground/90 ml-auto">
            {result.exitTime}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Coffee className="w-4 h-4 text-cyan-400" />
          <span className="text-xs text-muted-foreground">Rest:</span>
          <span className="text-sm font-mono font-semibold text-emerald-400 ml-auto">
            +{formatMinutes(result.restGainMinutes)}
          </span>
        </div>
      </div>

      {/* Anchor classes */}
      <div className="mb-3">
        <div className="flex items-center gap-1 mb-2">
          <CheckCircle2 className="w-3 h-3 text-cyan-400" />
          <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider">
            Anchor ({result.anchorClasses.length})
          </span>
        </div>
        <div className="space-y-1 max-h-24 overflow-y-auto">
          {result.anchorClasses.length === 0 ? (
            <span className="text-[10px] text-muted-foreground/50 italic">
              None
            </span>
          ) : (
            result.anchorClasses.map((block) => {
              const subject = getSubjectByCode(block.subjectCode);
              return (
                <div
                  key={`${block.day}-${block.slotIndex}`}
                  className="text-[10px] text-foreground/70 bg-cyan-500/10 rounded px-1.5 py-0.5 border border-cyan-500/20"
                >
                  <span className="font-mono">{TIME_SLOTS[block.slotIndex].start}</span>
                  {" - "}
                  {subject?.name.slice(0, 20)}
                  {(subject?.name.length ?? 0) > 20 ? "..." : ""}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Flexible classes */}
      <div>
        <div className="flex items-center gap-1 mb-2">
          <CircleDashed className="w-3 h-3 text-amber-400" />
          <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
            Flexible ({result.flexibleClasses.length})
          </span>
        </div>
        <div className="space-y-1 max-h-24 overflow-y-auto">
          {result.flexibleClasses.length === 0 ? (
            <span className="text-[10px] text-muted-foreground/50 italic">
              None
            </span>
          ) : (
            result.flexibleClasses.map((block) => {
              const subject = getSubjectByCode(block.subjectCode);
              return (
                <div
                  key={`${block.day}-${block.slotIndex}`}
                  className="text-[10px] text-foreground/70 bg-amber-500/10 rounded px-1.5 py-0.5 border border-amber-500/20"
                >
                  <span className="font-mono">{TIME_SLOTS[block.slotIndex].start}</span>
                  {" - "}
                  {subject?.name.slice(0, 20)}
                  {(subject?.name.length ?? 0) > 20 ? "..." : ""}
                </div>
              );
            })
          )}
        </div>
      </div>
    </motion.div>
  );
}
