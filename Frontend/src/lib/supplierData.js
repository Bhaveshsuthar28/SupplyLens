export function calculateComposite(otd, fillRate, rejectRate) {
  return Math.round((0.4 * otd) + (0.3 * fillRate) + (0.3 * (100 - rejectRate)));
}

export function getGrade(score) {
  if (score >= 95) return 'A';
  if (score >= 85) return 'B';
  if (score >= 70) return 'C';
  return 'D';
}

export function getGradeLabel(grade) {
  const labels = {
    A: 'Strategic Partner',
    B: 'Reliable',
    C: 'Needs Intervention',
    D: 'Critical Risk / Replace',
  };
  return labels[grade] || '';
}

export const CATEGORIES = ['All Categories', 'Packaging', 'Freight/Pkg', 'Components', 'Yarn', 'Fasteners', 'Raw Material'];
export const GRADES = ['All Grades', 'A', 'B', 'C', 'D'];
