export interface Supplier {
  id: string;
  name: string;
  category: string;
  otd: number;
  fillRate: number;
  rejectRate: number;
  compositeScore: number;
  grade: 'A' | 'B' | 'C' | 'D';
  trend: 'Stable' | 'Degrading' | 'Erratic' | 'Improving';
  weeklyScores: { week: string; otd: number; fillRate: number; rejectRate: number; composite: number }[];
}

export function calculateComposite(otd: number, fillRate: number, rejectRate: number): number {
  const qualityPerf = 100 - rejectRate;
  return Math.round(0.4 * otd + 0.3 * fillRate + 0.3 * qualityPerf);
}

export function getGrade(score: number): 'A' | 'B' | 'C' | 'D' {
  if (score >= 95) return 'A';
  if (score >= 85) return 'B';
  if (score >= 70) return 'C';
  return 'D';
}

export function getGradeLabel(grade: string): string {
  const labels: Record<string, string> = {
    A: 'Strategic Partner',
    B: 'Reliable',
    C: 'Needs Intervention',
    D: 'Critical Risk / Replace',
  };
  return labels[grade] || '';
}

export const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: 'S01', name: 'Alpha Steel Corp', category: 'Raw Material',
    otd: 98.2, fillRate: 99.5, rejectRate: 0.4,
    compositeScore: 99, grade: 'A', trend: 'Stable',
    weeklyScores: [
      { week: 'Week 4', otd: 98, fillRate: 99, rejectRate: 0.3, composite: 99 },
      { week: 'Week 3', otd: 98, fillRate: 100, rejectRate: 0.5, composite: 99 },
      { week: 'Week 2', otd: 99, fillRate: 99, rejectRate: 0.4, composite: 99 },
      { week: 'Week 1', otd: 98, fillRate: 99, rejectRate: 0.4, composite: 99 },
    ],
  },
  {
    id: 'S02', name: 'Bharat Polymers', category: 'Raw Material',
    otd: 94.1, fillRate: 96.0, rejectRate: 1.2,
    compositeScore: 91, grade: 'B', trend: 'Stable',
    weeklyScores: [
      { week: 'Week 4', otd: 95, fillRate: 96, rejectRate: 1.0, composite: 92 },
      { week: 'Week 3', otd: 94, fillRate: 96, rejectRate: 1.2, composite: 91 },
      { week: 'Week 2', otd: 93, fillRate: 95, rejectRate: 1.5, composite: 90 },
      { week: 'Week 1', otd: 94, fillRate: 97, rejectRate: 1.1, composite: 92 },
    ],
  },
  {
    id: 'S03', name: 'PolyPack Industries', category: 'Packaging',
    otd: 92.0, fillRate: 87.4, rejectRate: 0.8,
    compositeScore: 83, grade: 'C', trend: 'Erratic',
    weeklyScores: [
      { week: 'Week 4', otd: 94, fillRate: 90, rejectRate: 0.5, composite: 85 },
      { week: 'Week 3', otd: 88, fillRate: 85, rejectRate: 1.2, composite: 80 },
      { week: 'Week 2', otd: 93, fillRate: 88, rejectRate: 0.6, composite: 84 },
      { week: 'Week 1', otd: 93, fillRate: 86, rejectRate: 0.9, composite: 83 },
    ],
  },
  {
    id: 'S04', name: 'Tech-Tronics Ltd', category: 'Components',
    otd: 96.5, fillRate: 98.0, rejectRate: 0.8,
    compositeScore: 93, grade: 'B', trend: 'Degrading',
    weeklyScores: [
      { week: 'Week 4', otd: 98, fillRate: 99, rejectRate: 0.3, composite: 96 },
      { week: 'Week 3', otd: 97, fillRate: 98, rejectRate: 0.5, composite: 94 },
      { week: 'Week 2', otd: 95, fillRate: 97, rejectRate: 1.0, composite: 92 },
      { week: 'Week 1', otd: 96, fillRate: 98, rejectRate: 1.4, composite: 91 },
    ],
  },
  {
    id: 'S05', name: 'Global Resins', category: 'Raw Material',
    otd: 88.5, fillRate: 92.0, rejectRate: 2.1,
    compositeScore: 86, grade: 'B', trend: 'Stable',
    weeklyScores: [
      { week: 'Week 4', otd: 89, fillRate: 92, rejectRate: 2.0, composite: 86 },
      { week: 'Week 3', otd: 88, fillRate: 91, rejectRate: 2.3, composite: 85 },
      { week: 'Week 2', otd: 89, fillRate: 93, rejectRate: 1.9, composite: 87 },
      { week: 'Week 1', otd: 88, fillRate: 92, rejectRate: 2.2, composite: 86 },
    ],
  },
  {
    id: 'S06', name: 'Apex Auto Components', category: 'Fasteners',
    otd: 76.0, fillRate: 99.0, rejectRate: 1.0,
    compositeScore: 85, grade: 'B', trend: 'Erratic',
    weeklyScores: [
      { week: 'Week 4', otd: 80, fillRate: 99, rejectRate: 0.8, composite: 87 },
      { week: 'Week 3', otd: 72, fillRate: 99, rejectRate: 1.2, composite: 83 },
      { week: 'Week 2', otd: 78, fillRate: 99, rejectRate: 0.9, composite: 86 },
      { week: 'Week 1', otd: 74, fillRate: 99, rejectRate: 1.1, composite: 84 },
    ],
  },
  {
    id: 'S07', name: 'Vardhman Textiles', category: 'Components',
    otd: 95.0, fillRate: 99.0, rejectRate: 8.5,
    compositeScore: 69, grade: 'D', trend: 'Degrading',
    weeklyScores: [
      { week: 'Week 4', otd: 97, fillRate: 99, rejectRate: 4.5, composite: 82 },
      { week: 'Week 3', otd: 97, fillRate: 99, rejectRate: 6.1, composite: 80 },
      { week: 'Week 2', otd: 99, fillRate: 99, rejectRate: 4.5, composite: 75 },
      { week: 'Week 1', otd: 94, fillRate: 99, rejectRate: 8.5, composite: 69 },
    ],
  },
  {
    id: 'S08', name: 'Krishna Cartons', category: 'Packaging',
    otd: 99.0, fillRate: 82.5, rejectRate: 0.2,
    compositeScore: 75, grade: 'C', trend: 'Stable',
    weeklyScores: [
      { week: 'Week 4', otd: 99, fillRate: 83, rejectRate: 0.2, composite: 75 },
      { week: 'Week 3', otd: 99, fillRate: 82, rejectRate: 0.3, composite: 74 },
      { week: 'Week 2', otd: 98, fillRate: 83, rejectRate: 0.1, composite: 76 },
      { week: 'Week 1', otd: 99, fillRate: 82, rejectRate: 0.2, composite: 75 },
    ],
  },
  {
    id: 'S09', name: 'NeoCast Foundries', category: 'Components',
    otd: 65.0, fillRate: 88.0, rejectRate: 3.6,
    compositeScore: 71, grade: 'C', trend: 'Erratic',
    weeklyScores: [
      { week: 'Week 4', otd: 70, fillRate: 90, rejectRate: 3.0, composite: 74 },
      { week: 'Week 3', otd: 60, fillRate: 86, rejectRate: 4.2, composite: 67 },
      { week: 'Week 2', otd: 68, fillRate: 89, rejectRate: 3.3, composite: 73 },
      { week: 'Week 1', otd: 62, fillRate: 87, rejectRate: 3.9, composite: 69 },
    ],
  },
  {
    id: 'S10', name: 'Prime Label Co.', category: 'Packaging',
    otd: 95.5, fillRate: 87.5, rejectRate: 0.4,
    compositeScore: 82, grade: 'C', trend: 'Degrading',
    weeklyScores: [
      { week: 'Week 4', otd: 97, fillRate: 90, rejectRate: 0.2, composite: 86 },
      { week: 'Week 3', otd: 96, fillRate: 88, rejectRate: 0.3, composite: 83 },
      { week: 'Week 2', otd: 95, fillRate: 87, rejectRate: 0.5, composite: 81 },
      { week: 'Week 1', otd: 94, fillRate: 85, rejectRate: 0.6, composite: 79 },
    ],
  },
  {
    id: 'S11', name: 'Deccan Synthetics', category: 'Raw Material',
    otd: 91.0, fillRate: 99.5, rejectRate: 1.6,
    compositeScore: 88, grade: 'B', trend: 'Stable',
    weeklyScores: [
      { week: 'Week 4', otd: 91, fillRate: 99, rejectRate: 1.5, composite: 88 },
      { week: 'Week 3', otd: 92, fillRate: 100, rejectRate: 1.4, composite: 89 },
      { week: 'Week 2', otd: 90, fillRate: 99, rejectRate: 1.8, composite: 87 },
      { week: 'Week 1', otd: 91, fillRate: 99, rejectRate: 1.7, composite: 88 },
    ],
  },
  {
    id: 'S12', name: 'Precision Gears', category: 'Components',
    otd: 96.5, fillRate: 92.0, rejectRate: 2.1,
    compositeScore: 81, grade: 'C', trend: 'Erratic',
    weeklyScores: [
      { week: 'Week 4', otd: 97, fillRate: 94, rejectRate: 1.5, composite: 84 },
      { week: 'Week 3', otd: 95, fillRate: 90, rejectRate: 2.8, composite: 78 },
      { week: 'Week 2', otd: 97, fillRate: 93, rejectRate: 1.8, composite: 83 },
      { week: 'Week 1', otd: 96, fillRate: 91, rejectRate: 2.3, composite: 80 },
    ],
  },
  {
    id: 'S13', name: 'United Glassworks', category: 'Raw Material',
    otd: 88.0, fillRate: 92.0, rejectRate: 2.5,
    compositeScore: 63, grade: 'D', trend: 'Degrading',
    weeklyScores: [
      { week: 'Week 4', otd: 92, fillRate: 95, rejectRate: 1.5, composite: 86 },
      { week: 'Week 3', otd: 90, fillRate: 93, rejectRate: 2.0, composite: 83 },
      { week: 'Week 2', otd: 86, fillRate: 90, rejectRate: 3.0, composite: 78 },
      { week: 'Week 1', otd: 84, fillRate: 90, rejectRate: 3.5, composite: 63 },
    ],
  },
  {
    id: 'S14', name: 'Standard Chemicals', category: 'Raw Material',
    otd: 96.5, fillRate: 92.5, rejectRate: 2.6,
    compositeScore: 79, grade: 'C', trend: 'Stable',
    weeklyScores: [
      { week: 'Week 4', otd: 97, fillRate: 93, rejectRate: 2.4, composite: 80 },
      { week: 'Week 3', otd: 96, fillRate: 92, rejectRate: 2.7, composite: 79 },
      { week: 'Week 2', otd: 96, fillRate: 93, rejectRate: 2.5, composite: 79 },
      { week: 'Week 1', otd: 97, fillRate: 92, rejectRate: 2.8, composite: 79 },
    ],
  },
];

export const CATEGORIES = ['All Categories', 'Raw Material', 'Packaging', 'Components', 'Fasteners'];
export const GRADES = ['All Grades', 'A', 'B', 'C', 'D'];
