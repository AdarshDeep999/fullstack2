import {
  ClassBlock,
  Day,
  DAYS,
  getSubjectByCode,
  TIMETABLE,
  TIME_SLOTS,
} from "./attendance-data";

export interface OptimizationResult {
  day: Day;
  entryTime: string;
  exitTime: string;
  restGainMinutes: number;
  anchorClasses: ClassBlock[];
  flexibleClasses: ClassBlock[];
}

export interface OptimizerInput {
  attendance: Record<string, number>;
  importantClasses: Set<string>; // Set of "day-slotIndex" keys
  maxFlexible: number;
  riskMode: number; // 0-100, 0 = safe, 100 = aggressive
}

export function runOptimizer(input: OptimizerInput): OptimizationResult[] {
  const { attendance, importantClasses, maxFlexible, riskMode } = input;
  const results: OptimizationResult[] = [];

  // Collect all classes with their risk scores
  const allClasses: {
    block: ClassBlock;
    key: string;
    isRisky: boolean;
    isMajorProject: boolean;
    isImportant: boolean;
    flexScore: number;
  }[] = [];

  for (const day of DAYS) {
    const daySchedule = TIMETABLE[day];
    for (let i = 0; i < daySchedule.length; i++) {
      const block = daySchedule[i];
      if (!block) continue;

      const subject = getSubjectByCode(block.subjectCode);
      if (!subject) continue;

      const currentAttendance = attendance[block.subjectCode] ?? 75;
      const key = `${day}-${i}`;
      const isRisky = currentAttendance < subject.minAttendance;
      const isMajorProject = block.subjectCode === "23CSR-399";
      const isImportant = importantClasses.has(key);

      // Calculate flexibility score (higher = more flexible)
      let flexScore = 0;

      // Attendance buffer bonus (more buffer = more flexible)
      const buffer = currentAttendance - subject.minAttendance;
      flexScore += Math.max(0, buffer) * 2;

      // First class of day bonus (late entry)
      const firstBlockIndex = daySchedule.findIndex((b) => b !== null);
      if (i === firstBlockIndex) {
        flexScore += 30;
      }

      // Last class of day bonus (early exit)
      let lastBlockIndex = -1;
      for (let j = daySchedule.length - 1; j >= 0; j--) {
        if (daySchedule[j] !== null) {
          lastBlockIndex = j;
          break;
        }
      }
      if (i === lastBlockIndex) {
        flexScore += 25;
      }

      // Middle class gap reduction bonus
      if (i > firstBlockIndex && i < lastBlockIndex) {
        // Check if skipping this creates a bigger continuous block
        const prevBlock = daySchedule[i - 1];
        const nextBlock = daySchedule[i + 1];
        if (prevBlock === null || nextBlock === null) {
          flexScore += 15; // Adjacent to a gap
        }
      }

      // Apply risk mode multiplier
      flexScore = flexScore * (1 + riskMode / 100);

      allClasses.push({
        block,
        key,
        isRisky,
        isMajorProject,
        isImportant,
        flexScore,
      });
    }
  }

  // Sort by flexibility score (descending) - most flexible first
  const sortedForFlex = [...allClasses]
    .filter((c) => !c.isRisky && !c.isImportant && !c.isMajorProject)
    .sort((a, b) => b.flexScore - a.flexScore);

  // Select top N flexible classes
  const flexibleKeys = new Set(
    sortedForFlex.slice(0, maxFlexible).map((c) => c.key)
  );

  // Now generate results per day
  for (const day of DAYS) {
    const daySchedule = TIMETABLE[day];
    const anchorClasses: ClassBlock[] = [];
    const flexibleClasses: ClassBlock[] = [];

    for (let i = 0; i < daySchedule.length; i++) {
      const block = daySchedule[i];
      if (!block) continue;

      const key = `${day}-${i}`;
      const classInfo = allClasses.find((c) => c.key === key);

      if (!classInfo) continue;

      // Determine if anchor or flexible
      const isAnchor =
        classInfo.isRisky ||
        classInfo.isImportant ||
        !flexibleKeys.has(key);

      // Major Project is never forced as anchor (but can be flexible)
      if (classInfo.isMajorProject && !classInfo.isImportant) {
        flexibleClasses.push(block);
      } else if (flexibleKeys.has(key)) {
        flexibleClasses.push(block);
      } else {
        anchorClasses.push(block);
      }
    }

    // Calculate entry/exit times based on anchor classes
    let entryTime = "N/A";
    let exitTime = "N/A";
    let restGainMinutes = 0;

    if (anchorClasses.length > 0) {
      const anchorSlots = anchorClasses.map((c) => c.slotIndex).sort((a, b) => a - b);
      const firstAnchorSlot = anchorSlots[0];
      const lastAnchorSlot = anchorSlots[anchorSlots.length - 1];

      entryTime = TIME_SLOTS[firstAnchorSlot].start;
      exitTime = TIME_SLOTS[lastAnchorSlot].end;

      // Calculate rest gain
      const fullDayStart = TIME_SLOTS[0].start;
      const fullDayEnd = TIME_SLOTS[TIME_SLOTS.length - 1].end;

      const fullDayMinutes = getMinutesBetween(fullDayStart, fullDayEnd);
      const anchorSpanMinutes = getMinutesBetween(entryTime, exitTime);

      restGainMinutes = fullDayMinutes - anchorSpanMinutes;
    } else {
      // No anchor classes - full day off!
      restGainMinutes = getMinutesBetween(
        TIME_SLOTS[0].start,
        TIME_SLOTS[TIME_SLOTS.length - 1].end
      );
      entryTime = "Free Day";
      exitTime = "Free Day";
    }

    results.push({
      day,
      entryTime,
      exitTime,
      restGainMinutes,
      anchorClasses,
      flexibleClasses,
    });
  }

  return results;
}

function getMinutesBetween(start: string, end: string): number {
  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);
  return (endH * 60 + endM) - (startH * 60 + startM);
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}
