// Subjects with their codes, names, and minimum attendance requirements
export interface Subject {
  code: string;
  name: string;
  minAttendance: number;
}

export const SUBJECTS: Subject[] = [
  { code: "23CSH-374", name: "Software Engineering", minAttendance: 75 },
  { code: "23CSH-378", name: "Artificial Intelligence", minAttendance: 75 },
  { code: "23CSH-379", name: "Advanced Machine Learning and Mathematical Modelling", minAttendance: 75 },
  { code: "23CSH-382", name: "Full Stack-II", minAttendance: 75 },
  { code: "23CSP-378", name: "Competitive Coding-II", minAttendance: 75 },
  { code: "23CSR-399", name: "Major Project", minAttendance: 0 },
  { code: "23CST-390", name: "System Design", minAttendance: 75 },
  { code: "23TDP-361", name: "Soft Skills IV", minAttendance: 90 },
  { code: "23TDT-362", name: "Aptitude-IV", minAttendance: 90 },
  { code: "23UCT-392", name: "Leadership and Time Management", minAttendance: 75 },
];

export type ClassType = "L" | "P" | "T";

export interface TimeSlot {
  start: string;
  end: string;
  label: string;
}

export const TIME_SLOTS: TimeSlot[] = [
  { start: "09:30", end: "10:20", label: "09:30–10:20" },
  { start: "10:20", end: "11:10", label: "10:20–11:10" },
  { start: "11:20", end: "12:10", label: "11:20–12:10" },
  { start: "12:10", end: "13:00", label: "12:10–13:00" },
  { start: "13:55", end: "14:45", label: "13:55–14:45" },
  { start: "14:45", end: "15:35", label: "14:45–15:35" },
  { start: "15:35", end: "16:25", label: "15:35–16:25" },
];

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;
export type Day = (typeof DAYS)[number];

export interface ClassBlock {
  subjectCode: string;
  type: ClassType;
  day: Day;
  slotIndex: number;
}

// Weekly timetable data
export const TIMETABLE: Record<Day, (ClassBlock | null)[]> = {
  Mon: [
    { subjectCode: "23CSP-378", type: "P", day: "Mon", slotIndex: 0 },
    { subjectCode: "23CSP-378", type: "P", day: "Mon", slotIndex: 1 },
    { subjectCode: "23CST-390", type: "L", day: "Mon", slotIndex: 2 },
    null, // 12:10-13:00 is free
    { subjectCode: "23CSR-399", type: "P", day: "Mon", slotIndex: 4 },
    { subjectCode: "23CSH-382", type: "P", day: "Mon", slotIndex: 5 },
    { subjectCode: "23CSH-382", type: "P", day: "Mon", slotIndex: 6 },
  ],
  Tue: [
    { subjectCode: "23CST-390", type: "L", day: "Tue", slotIndex: 0 },
    { subjectCode: "23CSH-374", type: "L", day: "Tue", slotIndex: 1 },
    { subjectCode: "23CSH-374", type: "P", day: "Tue", slotIndex: 2 },
    { subjectCode: "23CSH-374", type: "P", day: "Tue", slotIndex: 3 },
    { subjectCode: "23CSH-379", type: "L", day: "Tue", slotIndex: 4 },
    { subjectCode: "23CSH-379", type: "P", day: "Tue", slotIndex: 5 },
    { subjectCode: "23CSH-379", type: "P", day: "Tue", slotIndex: 6 },
  ],
  Wed: [
    { subjectCode: "23CSH-382", type: "T", day: "Wed", slotIndex: 0 },
    null, // 10:20-11:10 is free
    { subjectCode: "23CSP-378", type: "P", day: "Wed", slotIndex: 2 },
    { subjectCode: "23CSP-378", type: "P", day: "Wed", slotIndex: 3 },
    { subjectCode: "23TDT-362", type: "L", day: "Wed", slotIndex: 4 },
    { subjectCode: "23TDT-362", type: "L", day: "Wed", slotIndex: 5 },
    { subjectCode: "23CSH-379", type: "L", day: "Wed", slotIndex: 6 },
  ],
  Thu: [
    { subjectCode: "23UCT-392", type: "L", day: "Thu", slotIndex: 0 },
    { subjectCode: "23CSH-374", type: "L", day: "Thu", slotIndex: 1 },
    { subjectCode: "23CSH-379", type: "L", day: "Thu", slotIndex: 2 },
    { subjectCode: "23CSH-378", type: "L", day: "Thu", slotIndex: 3 },
    { subjectCode: "23CSH-378", type: "P", day: "Thu", slotIndex: 4 },
    { subjectCode: "23CSH-378", type: "P", day: "Thu", slotIndex: 5 },
    { subjectCode: "23CST-390", type: "L", day: "Thu", slotIndex: 6 },
  ],
  Fri: [
    { subjectCode: "23TDP-361", type: "P", day: "Fri", slotIndex: 0 },
    { subjectCode: "23TDP-361", type: "P", day: "Fri", slotIndex: 1 },
    { subjectCode: "23CSH-378", type: "L", day: "Fri", slotIndex: 2 },
    { subjectCode: "23CSH-374", type: "L", day: "Fri", slotIndex: 3 },
    { subjectCode: "23CSH-382", type: "P", day: "Fri", slotIndex: 4 },
    { subjectCode: "23CSH-382", type: "P", day: "Fri", slotIndex: 5 },
    { subjectCode: "23CSH-378", type: "L", day: "Fri", slotIndex: 6 },
  ],
};

export function getSubjectByCode(code: string): Subject | undefined {
  return SUBJECTS.find((s) => s.code === code);
}

export function getClassTypeLabel(type: ClassType): string {
  switch (type) {
    case "L":
      return "Lecture";
    case "P":
      return "Practical";
    case "T":
      return "Tutorial";
  }
}

export function getClassBlockKey(block: ClassBlock): string {
  return `${block.day}-${block.slotIndex}`;
}
