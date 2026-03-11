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

export const MOCK_SUPPLIERS = [
  {
    "id": "S001",
    "name": "Krishna Supplies",
    "category": "Packaging",
    "otd": 74.2,
    "fillRate": 99,
    "rejectRate": 6.5,
    "compositeScore": 87,
    "grade": "B",
    "trend": "Erratic",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 72.1,
        "fillRate": 98,
        "rejectRate": 6.6,
        "composite": 86
      },
      {
        "week": "W2",
        "otd": 76.7,
        "fillRate": 97.6,
        "rejectRate": 7.3,
        "composite": 88
      },
      {
        "week": "W3",
        "otd": 76.4,
        "fillRate": 98.4,
        "rejectRate": 5.9,
        "composite": 88
      },
      {
        "week": "W4",
        "otd": 73.1,
        "fillRate": 96.7,
        "rejectRate": 6.3,
        "composite": 86
      }
    ]
  },
  {
    "id": "S002",
    "name": "Omega Corp",
    "category": "Freight/Pkg",
    "otd": 65.7,
    "fillRate": 85.3,
    "rejectRate": 2,
    "compositeScore": 81,
    "grade": "C",
    "trend": "Erratic",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 65.5,
        "fillRate": 85.8,
        "rejectRate": 2.6,
        "composite": 81
      },
      {
        "week": "W2",
        "otd": 67.7,
        "fillRate": 84.6,
        "rejectRate": 1.3,
        "composite": 82
      },
      {
        "week": "W3",
        "otd": 64.5,
        "fillRate": 86.6,
        "rejectRate": 2.7,
        "composite": 81
      },
      {
        "week": "W4",
        "otd": 63.6,
        "fillRate": 86.8,
        "rejectRate": 1.6,
        "composite": 81
      }
    ]
  },
  {
    "id": "S003",
    "name": "Global Polymers",
    "category": "Components",
    "otd": 77.8,
    "fillRate": 87.1,
    "rejectRate": 8.7,
    "compositeScore": 85,
    "grade": "B",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 78.2,
        "fillRate": 85.2,
        "rejectRate": 8.8,
        "composite": 84
      },
      {
        "week": "W2",
        "otd": 77.8,
        "fillRate": 89.2,
        "rejectRate": 8.2,
        "composite": 85
      },
      {
        "week": "W3",
        "otd": 77.6,
        "fillRate": 88.9,
        "rejectRate": 8.2,
        "composite": 85
      },
      {
        "week": "W4",
        "otd": 79.9,
        "fillRate": 86.3,
        "rejectRate": 8.4,
        "composite": 85
      }
    ]
  },
  {
    "id": "S004",
    "name": "Krishna Ltd",
    "category": "Components",
    "otd": 97.4,
    "fillRate": 86.7,
    "rejectRate": 4.3,
    "compositeScore": 94,
    "grade": "B",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 98.2,
        "fillRate": 88.8,
        "rejectRate": 4.7,
        "composite": 95
      },
      {
        "week": "W2",
        "otd": 95.8,
        "fillRate": 87.5,
        "rejectRate": 4.4,
        "composite": 93
      },
      {
        "week": "W3",
        "otd": 99.3,
        "fillRate": 86.1,
        "rejectRate": 3.3,
        "composite": 95
      },
      {
        "week": "W4",
        "otd": 99.8,
        "fillRate": 85.4,
        "rejectRate": 4,
        "composite": 94
      }
    ]
  },
  {
    "id": "S005",
    "name": "Alpha Corp",
    "category": "Packaging",
    "otd": 67.1,
    "fillRate": 93.7,
    "rejectRate": 0.4,
    "compositeScore": 85,
    "grade": "B",
    "trend": "Degrading",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 67.6,
        "fillRate": 95.7,
        "rejectRate": 0.3,
        "composite": 86
      },
      {
        "week": "W2",
        "otd": 64.9,
        "fillRate": 93.3,
        "rejectRate": 0,
        "composite": 84
      },
      {
        "week": "W3",
        "otd": 68.8,
        "fillRate": 94.7,
        "rejectRate": 1.1,
        "composite": 86
      },
      {
        "week": "W4",
        "otd": 65.8,
        "fillRate": 91.9,
        "rejectRate": 1,
        "composite": 84
      }
    ]
  },
  {
    "id": "S006",
    "name": "Swift Ltd",
    "category": "Components",
    "otd": 88,
    "fillRate": 85.5,
    "rejectRate": 1,
    "compositeScore": 91,
    "grade": "B",
    "trend": "Erratic",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 89.5,
        "fillRate": 87.8,
        "rejectRate": 0.3,
        "composite": 92
      },
      {
        "week": "W2",
        "otd": 85.8,
        "fillRate": 83,
        "rejectRate": 0.1,
        "composite": 89
      },
      {
        "week": "W3",
        "otd": 88.4,
        "fillRate": 85.8,
        "rejectRate": 0.1,
        "composite": 91
      },
      {
        "week": "W4",
        "otd": 85.9,
        "fillRate": 87.6,
        "rejectRate": 0,
        "composite": 91
      }
    ]
  },
  {
    "id": "S007",
    "name": "Prime Foundries",
    "category": "Freight/Pkg",
    "otd": 65.3,
    "fillRate": 96,
    "rejectRate": 8.7,
    "compositeScore": 82,
    "grade": "C",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 67.4,
        "fillRate": 97.4,
        "rejectRate": 8.2,
        "composite": 84
      },
      {
        "week": "W2",
        "otd": 66.9,
        "fillRate": 97.5,
        "rejectRate": 8.6,
        "composite": 83
      },
      {
        "week": "W3",
        "otd": 66.8,
        "fillRate": 98,
        "rejectRate": 7.8,
        "composite": 84
      },
      {
        "week": "W4",
        "otd": 64.3,
        "fillRate": 97.5,
        "rejectRate": 9,
        "composite": 82
      }
    ]
  },
  {
    "id": "S008",
    "name": "Alpha Components",
    "category": "Freight/Pkg",
    "otd": 91,
    "fillRate": 93.6,
    "rejectRate": 2.4,
    "compositeScore": 94,
    "grade": "B",
    "trend": "Erratic",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 90.3,
        "fillRate": 92.4,
        "rejectRate": 3,
        "composite": 93
      },
      {
        "week": "W2",
        "otd": 90.5,
        "fillRate": 95.9,
        "rejectRate": 2.5,
        "composite": 94
      },
      {
        "week": "W3",
        "otd": 91.5,
        "fillRate": 93.5,
        "rejectRate": 2.7,
        "composite": 94
      },
      {
        "week": "W4",
        "otd": 91,
        "fillRate": 93.2,
        "rejectRate": 3.3,
        "composite": 93
      }
    ]
  },
  {
    "id": "S009",
    "name": "Tech Corp",
    "category": "Yarn",
    "otd": 74.8,
    "fillRate": 89.6,
    "rejectRate": 1.4,
    "compositeScore": 86,
    "grade": "B",
    "trend": "Degrading",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 73.9,
        "fillRate": 92,
        "rejectRate": 2.2,
        "composite": 87
      },
      {
        "week": "W2",
        "otd": 75.4,
        "fillRate": 89.1,
        "rejectRate": 0.6,
        "composite": 87
      },
      {
        "week": "W3",
        "otd": 75.5,
        "fillRate": 87.2,
        "rejectRate": 1,
        "composite": 86
      },
      {
        "week": "W4",
        "otd": 75.7,
        "fillRate": 90.5,
        "rejectRate": 1,
        "composite": 87
      }
    ]
  },
  {
    "id": "S010",
    "name": "Elite Foundries",
    "category": "Freight/Pkg",
    "otd": 87,
    "fillRate": 90.6,
    "rejectRate": 3.6,
    "compositeScore": 91,
    "grade": "B",
    "trend": "Degrading",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 87.5,
        "fillRate": 92.4,
        "rejectRate": 3.4,
        "composite": 92
      },
      {
        "week": "W2",
        "otd": 86.7,
        "fillRate": 91.4,
        "rejectRate": 3.6,
        "composite": 91
      },
      {
        "week": "W3",
        "otd": 88.5,
        "fillRate": 91.4,
        "rejectRate": 3.4,
        "composite": 92
      },
      {
        "week": "W4",
        "otd": 86,
        "fillRate": 88.7,
        "rejectRate": 2.9,
        "composite": 90
      }
    ]
  },
  {
    "id": "S011",
    "name": "Swift Supplies",
    "category": "Packaging",
    "otd": 70.1,
    "fillRate": 95.8,
    "rejectRate": 8.4,
    "compositeScore": 84,
    "grade": "C",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 70.3,
        "fillRate": 93.4,
        "rejectRate": 8.6,
        "composite": 84
      },
      {
        "week": "W2",
        "otd": 68.6,
        "fillRate": 97.3,
        "rejectRate": 9.3,
        "composite": 84
      },
      {
        "week": "W3",
        "otd": 70.2,
        "fillRate": 95.4,
        "rejectRate": 7.4,
        "composite": 84
      },
      {
        "week": "W4",
        "otd": 70.4,
        "fillRate": 97.4,
        "rejectRate": 9.1,
        "composite": 85
      }
    ]
  },
  {
    "id": "S012",
    "name": "Swift Industries",
    "category": "Freight/Pkg",
    "otd": 75.4,
    "fillRate": 86.1,
    "rejectRate": 8,
    "compositeScore": 84,
    "grade": "C",
    "trend": "Erratic",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 76,
        "fillRate": 86.4,
        "rejectRate": 7.5,
        "composite": 84
      },
      {
        "week": "W2",
        "otd": 76.7,
        "fillRate": 85.5,
        "rejectRate": 8,
        "composite": 84
      },
      {
        "week": "W3",
        "otd": 77.7,
        "fillRate": 85.1,
        "rejectRate": 8.3,
        "composite": 84
      },
      {
        "week": "W4",
        "otd": 73.1,
        "fillRate": 83.7,
        "rejectRate": 8.2,
        "composite": 82
      }
    ]
  },
  {
    "id": "S013",
    "name": "Krishna Polymers",
    "category": "Components",
    "otd": 96,
    "fillRate": 90.5,
    "rejectRate": 1.4,
    "compositeScore": 95,
    "grade": "A",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 94.9,
        "fillRate": 90.2,
        "rejectRate": 0.7,
        "composite": 95
      },
      {
        "week": "W2",
        "otd": 98.3,
        "fillRate": 88.2,
        "rejectRate": 2.3,
        "composite": 95
      },
      {
        "week": "W3",
        "otd": 95.3,
        "fillRate": 88.2,
        "rejectRate": 0.9,
        "composite": 94
      },
      {
        "week": "W4",
        "otd": 96,
        "fillRate": 91.6,
        "rejectRate": 1.9,
        "composite": 95
      }
    ]
  },
  {
    "id": "S014",
    "name": "Krishna Foundries",
    "category": "Fasteners",
    "otd": 95.2,
    "fillRate": 94.3,
    "rejectRate": 3.5,
    "compositeScore": 95,
    "grade": "A",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 93.8,
        "fillRate": 93.7,
        "rejectRate": 3.6,
        "composite": 95
      },
      {
        "week": "W2",
        "otd": 94.3,
        "fillRate": 95.2,
        "rejectRate": 2.8,
        "composite": 95
      },
      {
        "week": "W3",
        "otd": 94.5,
        "fillRate": 92.2,
        "rejectRate": 4.3,
        "composite": 94
      },
      {
        "week": "W4",
        "otd": 93.6,
        "fillRate": 95.3,
        "rejectRate": 2.7,
        "composite": 95
      }
    ]
  },
  {
    "id": "S015",
    "name": "Alpha Supplies",
    "category": "Raw Material",
    "otd": 77.5,
    "fillRate": 95.1,
    "rejectRate": 4.3,
    "compositeScore": 88,
    "grade": "B",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 76.7,
        "fillRate": 94.4,
        "rejectRate": 5,
        "composite": 88
      },
      {
        "week": "W2",
        "otd": 78.2,
        "fillRate": 92.8,
        "rejectRate": 4,
        "composite": 88
      },
      {
        "week": "W3",
        "otd": 78,
        "fillRate": 94.5,
        "rejectRate": 5.3,
        "composite": 88
      },
      {
        "week": "W4",
        "otd": 78.3,
        "fillRate": 94.8,
        "rejectRate": 5.1,
        "composite": 88
      }
    ]
  },
  {
    "id": "S016",
    "name": "Global Ltd",
    "category": "Packaging",
    "otd": 65.5,
    "fillRate": 86.5,
    "rejectRate": 2.4,
    "compositeScore": 81,
    "grade": "C",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 63.6,
        "fillRate": 87.9,
        "rejectRate": 3.1,
        "composite": 81
      },
      {
        "week": "W2",
        "otd": 63.9,
        "fillRate": 84.6,
        "rejectRate": 1.5,
        "composite": 80
      },
      {
        "week": "W3",
        "otd": 64.8,
        "fillRate": 84.4,
        "rejectRate": 3.2,
        "composite": 80
      },
      {
        "week": "W4",
        "otd": 66.5,
        "fillRate": 84.7,
        "rejectRate": 3.4,
        "composite": 81
      }
    ]
  },
  {
    "id": "S017",
    "name": "Omega Foundries",
    "category": "Freight/Pkg",
    "otd": 79.1,
    "fillRate": 86.3,
    "rejectRate": 2.8,
    "compositeScore": 87,
    "grade": "B",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 78.5,
        "fillRate": 87.8,
        "rejectRate": 2.5,
        "composite": 87
      },
      {
        "week": "W2",
        "otd": 81.2,
        "fillRate": 84.3,
        "rejectRate": 2,
        "composite": 87
      },
      {
        "week": "W3",
        "otd": 77.2,
        "fillRate": 87.4,
        "rejectRate": 3.5,
        "composite": 86
      },
      {
        "week": "W4",
        "otd": 79.4,
        "fillRate": 86.4,
        "rejectRate": 2.2,
        "composite": 87
      }
    ]
  },
  {
    "id": "S018",
    "name": "Zenith Foundries",
    "category": "Fasteners",
    "otd": 96.8,
    "fillRate": 95.5,
    "rejectRate": 1.5,
    "compositeScore": 97,
    "grade": "A",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 96.8,
        "fillRate": 95.8,
        "rejectRate": 2.2,
        "composite": 97
      },
      {
        "week": "W2",
        "otd": 99.1,
        "fillRate": 97.4,
        "rejectRate": 2.3,
        "composite": 98
      },
      {
        "week": "W3",
        "otd": 97.1,
        "fillRate": 96.5,
        "rejectRate": 2.5,
        "composite": 97
      },
      {
        "week": "W4",
        "otd": 99,
        "fillRate": 97.4,
        "rejectRate": 0.7,
        "composite": 99
      }
    ]
  },
  {
    "id": "S019",
    "name": "Krishna Supplies",
    "category": "Packaging",
    "otd": 82.5,
    "fillRate": 85.2,
    "rejectRate": 4.2,
    "compositeScore": 87,
    "grade": "B",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 83.6,
        "fillRate": 83.7,
        "rejectRate": 3.8,
        "composite": 87
      },
      {
        "week": "W2",
        "otd": 83.6,
        "fillRate": 85.3,
        "rejectRate": 5.1,
        "composite": 88
      },
      {
        "week": "W3",
        "otd": 84.3,
        "fillRate": 85.5,
        "rejectRate": 4.3,
        "composite": 88
      },
      {
        "week": "W4",
        "otd": 83.4,
        "fillRate": 84.8,
        "rejectRate": 4.2,
        "composite": 88
      }
    ]
  },
  {
    "id": "S020",
    "name": "Standard Polymers",
    "category": "Components",
    "otd": 81.5,
    "fillRate": 88,
    "rejectRate": 6.9,
    "compositeScore": 87,
    "grade": "B",
    "trend": "Erratic",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 82.5,
        "fillRate": 87.9,
        "rejectRate": 6.3,
        "composite": 87
      },
      {
        "week": "W2",
        "otd": 82.4,
        "fillRate": 86,
        "rejectRate": 7.6,
        "composite": 86
      },
      {
        "week": "W3",
        "otd": 82.4,
        "fillRate": 90.3,
        "rejectRate": 6.5,
        "composite": 88
      },
      {
        "week": "W4",
        "otd": 81.7,
        "fillRate": 86.3,
        "rejectRate": 6,
        "composite": 87
      }
    ]
  },
  {
    "id": "S021",
    "name": "Micro Ltd",
    "category": "Freight/Pkg",
    "otd": 69.4,
    "fillRate": 95.2,
    "rejectRate": 2.2,
    "compositeScore": 86,
    "grade": "B",
    "trend": "Erratic",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 71.1,
        "fillRate": 95.1,
        "rejectRate": 1.5,
        "composite": 87
      },
      {
        "week": "W2",
        "otd": 69.6,
        "fillRate": 94.8,
        "rejectRate": 2.3,
        "composite": 86
      },
      {
        "week": "W3",
        "otd": 71.8,
        "fillRate": 96.7,
        "rejectRate": 1.4,
        "composite": 87
      },
      {
        "week": "W4",
        "otd": 70.3,
        "fillRate": 94.1,
        "rejectRate": 1.6,
        "composite": 86
      }
    ]
  },
  {
    "id": "S022",
    "name": "National Corp",
    "category": "Yarn",
    "otd": 67.7,
    "fillRate": 98.6,
    "rejectRate": 6.8,
    "compositeScore": 85,
    "grade": "B",
    "trend": "Degrading",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 65.9,
        "fillRate": 100,
        "rejectRate": 6.2,
        "composite": 85
      },
      {
        "week": "W2",
        "otd": 69.3,
        "fillRate": 99.1,
        "rejectRate": 7.6,
        "composite": 85
      },
      {
        "week": "W3",
        "otd": 69.6,
        "fillRate": 98.2,
        "rejectRate": 7.4,
        "composite": 85
      },
      {
        "week": "W4",
        "otd": 68.3,
        "fillRate": 99.8,
        "rejectRate": 6.7,
        "composite": 85
      }
    ]
  },
  {
    "id": "S023",
    "name": "Omega Components",
    "category": "Components",
    "otd": 72.7,
    "fillRate": 89.4,
    "rejectRate": 6.6,
    "compositeScore": 84,
    "grade": "C",
    "trend": "Degrading",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 71,
        "fillRate": 89.3,
        "rejectRate": 7.2,
        "composite": 83
      },
      {
        "week": "W2",
        "otd": 73.4,
        "fillRate": 87.4,
        "rejectRate": 7.5,
        "composite": 83
      },
      {
        "week": "W3",
        "otd": 73.7,
        "fillRate": 87.3,
        "rejectRate": 6.3,
        "composite": 84
      },
      {
        "week": "W4",
        "otd": 72.7,
        "fillRate": 88.9,
        "rejectRate": 5.9,
        "composite": 84
      }
    ]
  },
  {
    "id": "S024",
    "name": "Krishna Components",
    "category": "Components",
    "otd": 79.3,
    "fillRate": 88.3,
    "rejectRate": 3.9,
    "compositeScore": 87,
    "grade": "B",
    "trend": "Erratic",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 81.6,
        "fillRate": 89.6,
        "rejectRate": 4.9,
        "composite": 88
      },
      {
        "week": "W2",
        "otd": 79.1,
        "fillRate": 88.7,
        "rejectRate": 3,
        "composite": 87
      },
      {
        "week": "W3",
        "otd": 81.4,
        "fillRate": 88.4,
        "rejectRate": 3.1,
        "composite": 88
      },
      {
        "week": "W4",
        "otd": 78.2,
        "fillRate": 87.9,
        "rejectRate": 4.2,
        "composite": 86
      }
    ]
  },
  {
    "id": "S025",
    "name": "Standard Ltd",
    "category": "Packaging",
    "otd": 72.9,
    "fillRate": 97.6,
    "rejectRate": 1,
    "compositeScore": 88,
    "grade": "B",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 71.8,
        "fillRate": 100,
        "rejectRate": 1.2,
        "composite": 88
      },
      {
        "week": "W2",
        "otd": 74.2,
        "fillRate": 97.8,
        "rejectRate": 0.5,
        "composite": 89
      },
      {
        "week": "W3",
        "otd": 75.3,
        "fillRate": 96,
        "rejectRate": 1.1,
        "composite": 89
      },
      {
        "week": "W4",
        "otd": 72.2,
        "fillRate": 99.9,
        "rejectRate": 1.1,
        "composite": 89
      }
    ]
  },
  {
    "id": "S026",
    "name": "Global Ltd",
    "category": "Components",
    "otd": 70,
    "fillRate": 89.1,
    "rejectRate": 0.8,
    "compositeScore": 84,
    "grade": "C",
    "trend": "Degrading",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 71.9,
        "fillRate": 87.9,
        "rejectRate": 1.4,
        "composite": 85
      },
      {
        "week": "W2",
        "otd": 68,
        "fillRate": 88,
        "rejectRate": 1.5,
        "composite": 83
      },
      {
        "week": "W3",
        "otd": 71.3,
        "fillRate": 89.2,
        "rejectRate": 0.6,
        "composite": 85
      },
      {
        "week": "W4",
        "otd": 70,
        "fillRate": 90.6,
        "rejectRate": 0.5,
        "composite": 85
      }
    ]
  },
  {
    "id": "S027",
    "name": "Micro Polymers",
    "category": "Yarn",
    "otd": 96.6,
    "fillRate": 86.8,
    "rejectRate": 5,
    "compositeScore": 93,
    "grade": "B",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 95.3,
        "fillRate": 88.1,
        "rejectRate": 6,
        "composite": 93
      },
      {
        "week": "W2",
        "otd": 98.5,
        "fillRate": 86.4,
        "rejectRate": 4.6,
        "composite": 94
      },
      {
        "week": "W3",
        "otd": 95.9,
        "fillRate": 86.2,
        "rejectRate": 4.5,
        "composite": 93
      },
      {
        "week": "W4",
        "otd": 94.4,
        "fillRate": 86.5,
        "rejectRate": 5.4,
        "composite": 92
      }
    ]
  },
  {
    "id": "S028",
    "name": "Precision Foundries",
    "category": "Yarn",
    "otd": 92.1,
    "fillRate": 97.7,
    "rejectRate": 8.3,
    "compositeScore": 94,
    "grade": "B",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 94.2,
        "fillRate": 98.4,
        "rejectRate": 7.4,
        "composite": 95
      },
      {
        "week": "W2",
        "otd": 94.2,
        "fillRate": 99.3,
        "rejectRate": 8,
        "composite": 95
      },
      {
        "week": "W3",
        "otd": 94,
        "fillRate": 97,
        "rejectRate": 9.3,
        "composite": 94
      },
      {
        "week": "W4",
        "otd": 94.2,
        "fillRate": 98,
        "rejectRate": 7.8,
        "composite": 95
      }
    ]
  },
  {
    "id": "S029",
    "name": "Standard Ltd",
    "category": "Yarn",
    "otd": 70.1,
    "fillRate": 90.3,
    "rejectRate": 4.2,
    "compositeScore": 84,
    "grade": "C",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 68.9,
        "fillRate": 89.2,
        "rejectRate": 4.7,
        "composite": 83
      },
      {
        "week": "W2",
        "otd": 71.8,
        "fillRate": 89.5,
        "rejectRate": 4.2,
        "composite": 84
      },
      {
        "week": "W3",
        "otd": 71.1,
        "fillRate": 88.4,
        "rejectRate": 4.8,
        "composite": 84
      },
      {
        "week": "W4",
        "otd": 69.1,
        "fillRate": 91.2,
        "rejectRate": 3.3,
        "composite": 84
      }
    ]
  },
  {
    "id": "S030",
    "name": "Prime Corp",
    "category": "Yarn",
    "otd": 84,
    "fillRate": 86.5,
    "rejectRate": 5,
    "compositeScore": 88,
    "grade": "B",
    "trend": "Erratic",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 83.3,
        "fillRate": 87.4,
        "rejectRate": 4.1,
        "composite": 88
      },
      {
        "week": "W2",
        "otd": 82.7,
        "fillRate": 85.6,
        "rejectRate": 5.2,
        "composite": 87
      },
      {
        "week": "W3",
        "otd": 83.7,
        "fillRate": 85.3,
        "rejectRate": 4.8,
        "composite": 88
      },
      {
        "week": "W4",
        "otd": 86.4,
        "fillRate": 86.5,
        "rejectRate": 5.2,
        "composite": 89
      }
    ]
  },
  {
    "id": "S031",
    "name": "Alpha Polymers",
    "category": "Raw Material",
    "otd": 88.2,
    "fillRate": 88.6,
    "rejectRate": 6.6,
    "compositeScore": 90,
    "grade": "B",
    "trend": "Erratic",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 87.2,
        "fillRate": 89.3,
        "rejectRate": 6.9,
        "composite": 90
      },
      {
        "week": "W2",
        "otd": 89,
        "fillRate": 89.2,
        "rejectRate": 6.6,
        "composite": 90
      },
      {
        "week": "W3",
        "otd": 88.9,
        "fillRate": 86.3,
        "rejectRate": 5.7,
        "composite": 90
      },
      {
        "week": "W4",
        "otd": 88.8,
        "fillRate": 88.9,
        "rejectRate": 6.1,
        "composite": 90
      }
    ]
  },
  {
    "id": "S032",
    "name": "Bharat Corp",
    "category": "Fasteners",
    "otd": 93.9,
    "fillRate": 96.5,
    "rejectRate": 7.6,
    "compositeScore": 94,
    "grade": "B",
    "trend": "Degrading",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 94.1,
        "fillRate": 98.2,
        "rejectRate": 8.5,
        "composite": 95
      },
      {
        "week": "W2",
        "otd": 93.3,
        "fillRate": 96.8,
        "rejectRate": 6.7,
        "composite": 94
      },
      {
        "week": "W3",
        "otd": 94.4,
        "fillRate": 95.6,
        "rejectRate": 8.2,
        "composite": 94
      },
      {
        "week": "W4",
        "otd": 96.3,
        "fillRate": 97.3,
        "rejectRate": 8.1,
        "composite": 95
      }
    ]
  },
  {
    "id": "S033",
    "name": "Standard Polymers",
    "category": "Freight/Pkg",
    "otd": 65.5,
    "fillRate": 95.6,
    "rejectRate": 6.8,
    "compositeScore": 83,
    "grade": "C",
    "trend": "Erratic",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 65.2,
        "fillRate": 97.8,
        "rejectRate": 7.8,
        "composite": 83
      },
      {
        "week": "W2",
        "otd": 67.4,
        "fillRate": 94.7,
        "rejectRate": 6.5,
        "composite": 83
      },
      {
        "week": "W3",
        "otd": 64.1,
        "fillRate": 97.1,
        "rejectRate": 6.3,
        "composite": 83
      },
      {
        "week": "W4",
        "otd": 67.6,
        "fillRate": 93.9,
        "rejectRate": 6.7,
        "composite": 83
      }
    ]
  },
  {
    "id": "S034",
    "name": "Deccan Corp",
    "category": "Freight/Pkg",
    "otd": 88.4,
    "fillRate": 91.2,
    "rejectRate": 0.3,
    "compositeScore": 93,
    "grade": "B",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 86.8,
        "fillRate": 91.3,
        "rejectRate": 0,
        "composite": 92
      },
      {
        "week": "W2",
        "otd": 90.6,
        "fillRate": 89.2,
        "rejectRate": 0,
        "composite": 93
      },
      {
        "week": "W3",
        "otd": 88,
        "fillRate": 89.8,
        "rejectRate": 0.2,
        "composite": 92
      },
      {
        "week": "W4",
        "otd": 89.3,
        "fillRate": 89.3,
        "rejectRate": 1.1,
        "composite": 92
      }
    ]
  },
  {
    "id": "S035",
    "name": "Micro Foundries",
    "category": "Yarn",
    "otd": 90.9,
    "fillRate": 92.1,
    "rejectRate": 5.5,
    "compositeScore": 92,
    "grade": "B",
    "trend": "Degrading",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 91.3,
        "fillRate": 92.8,
        "rejectRate": 5.4,
        "composite": 93
      },
      {
        "week": "W2",
        "otd": 93,
        "fillRate": 89.8,
        "rejectRate": 4.5,
        "composite": 93
      },
      {
        "week": "W3",
        "otd": 88.5,
        "fillRate": 93.6,
        "rejectRate": 4.6,
        "composite": 92
      },
      {
        "week": "W4",
        "otd": 92.6,
        "fillRate": 92.8,
        "rejectRate": 4.5,
        "composite": 94
      }
    ]
  },
  {
    "id": "S036",
    "name": "Krishna Industries",
    "category": "Freight/Pkg",
    "otd": 73.8,
    "fillRate": 88,
    "rejectRate": 3.3,
    "compositeScore": 85,
    "grade": "B",
    "trend": "Erratic",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 72.5,
        "fillRate": 87.3,
        "rejectRate": 3.1,
        "composite": 84
      },
      {
        "week": "W2",
        "otd": 73.1,
        "fillRate": 88.6,
        "rejectRate": 3.3,
        "composite": 85
      },
      {
        "week": "W3",
        "otd": 72.1,
        "fillRate": 86,
        "rejectRate": 2.3,
        "composite": 84
      },
      {
        "week": "W4",
        "otd": 71.6,
        "fillRate": 87.4,
        "rejectRate": 3.9,
        "composite": 84
      }
    ]
  },
  {
    "id": "S037",
    "name": "Deccan Ltd",
    "category": "Freight/Pkg",
    "otd": 69.8,
    "fillRate": 89.3,
    "rejectRate": 6.6,
    "compositeScore": 83,
    "grade": "C",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 70.5,
        "fillRate": 89.9,
        "rejectRate": 6.7,
        "composite": 83
      },
      {
        "week": "W2",
        "otd": 69.1,
        "fillRate": 91.3,
        "rejectRate": 7,
        "composite": 83
      },
      {
        "week": "W3",
        "otd": 70.3,
        "fillRate": 87.6,
        "rejectRate": 6.7,
        "composite": 82
      },
      {
        "week": "W4",
        "otd": 71.2,
        "fillRate": 88,
        "rejectRate": 6,
        "composite": 83
      }
    ]
  },
  {
    "id": "S038",
    "name": "Precision Components",
    "category": "Raw Material",
    "otd": 86.3,
    "fillRate": 86.4,
    "rejectRate": 7.4,
    "compositeScore": 88,
    "grade": "B",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 87.9,
        "fillRate": 88.2,
        "rejectRate": 8.1,
        "composite": 89
      },
      {
        "week": "W2",
        "otd": 87.5,
        "fillRate": 84.6,
        "rejectRate": 7.3,
        "composite": 88
      },
      {
        "week": "W3",
        "otd": 84.8,
        "fillRate": 86.2,
        "rejectRate": 6.5,
        "composite": 88
      },
      {
        "week": "W4",
        "otd": 84.2,
        "fillRate": 85.1,
        "rejectRate": 8.4,
        "composite": 87
      }
    ]
  },
  {
    "id": "S039",
    "name": "Global Industries",
    "category": "Freight/Pkg",
    "otd": 81.9,
    "fillRate": 90,
    "rejectRate": 7.9,
    "compositeScore": 87,
    "grade": "B",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 83.1,
        "fillRate": 92,
        "rejectRate": 8.5,
        "composite": 88
      },
      {
        "week": "W2",
        "otd": 80.4,
        "fillRate": 90,
        "rejectRate": 7.4,
        "composite": 87
      },
      {
        "week": "W3",
        "otd": 83.2,
        "fillRate": 92.2,
        "rejectRate": 7.6,
        "composite": 89
      },
      {
        "week": "W4",
        "otd": 80.8,
        "fillRate": 88.6,
        "rejectRate": 8.8,
        "composite": 86
      }
    ]
  },
  {
    "id": "S040",
    "name": "Tech Supplies",
    "category": "Fasteners",
    "otd": 80.1,
    "fillRate": 99.4,
    "rejectRate": 6.5,
    "compositeScore": 90,
    "grade": "B",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 82.6,
        "fillRate": 100,
        "rejectRate": 6.9,
        "composite": 91
      },
      {
        "week": "W2",
        "otd": 80.4,
        "fillRate": 99.2,
        "rejectRate": 6.3,
        "composite": 90
      },
      {
        "week": "W3",
        "otd": 81.5,
        "fillRate": 98.6,
        "rejectRate": 6.6,
        "composite": 90
      },
      {
        "week": "W4",
        "otd": 80.4,
        "fillRate": 99.3,
        "rejectRate": 5.6,
        "composite": 90
      }
    ]
  },
  {
    "id": "S041",
    "name": "Tech Ltd",
    "category": "Yarn",
    "otd": 69,
    "fillRate": 89.9,
    "rejectRate": 1,
    "compositeScore": 84,
    "grade": "C",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 68.9,
        "fillRate": 90.6,
        "rejectRate": 1.7,
        "composite": 84
      },
      {
        "week": "W2",
        "otd": 70.7,
        "fillRate": 87.7,
        "rejectRate": 1.8,
        "composite": 84
      },
      {
        "week": "W3",
        "otd": 68.1,
        "fillRate": 88.3,
        "rejectRate": 0.2,
        "composite": 84
      },
      {
        "week": "W4",
        "otd": 70.6,
        "fillRate": 88.7,
        "rejectRate": 0.2,
        "composite": 85
      }
    ]
  },
  {
    "id": "S042",
    "name": "Apex Corp",
    "category": "Raw Material",
    "otd": 88.9,
    "fillRate": 90.7,
    "rejectRate": 7.2,
    "compositeScore": 91,
    "grade": "B",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 91.4,
        "fillRate": 91.4,
        "rejectRate": 7,
        "composite": 92
      },
      {
        "week": "W2",
        "otd": 91.1,
        "fillRate": 92.6,
        "rejectRate": 7,
        "composite": 92
      },
      {
        "week": "W3",
        "otd": 88.6,
        "fillRate": 88.9,
        "rejectRate": 7.1,
        "composite": 90
      },
      {
        "week": "W4",
        "otd": 87.4,
        "fillRate": 91.5,
        "rejectRate": 6.7,
        "composite": 90
      }
    ]
  },
  {
    "id": "S043",
    "name": "Neo Ltd",
    "category": "Yarn",
    "otd": 92.7,
    "fillRate": 91.6,
    "rejectRate": 5.2,
    "compositeScore": 93,
    "grade": "B",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 92.3,
        "fillRate": 91.7,
        "rejectRate": 5.7,
        "composite": 93
      },
      {
        "week": "W2",
        "otd": 94.3,
        "fillRate": 91.3,
        "rejectRate": 4.7,
        "composite": 94
      },
      {
        "week": "W3",
        "otd": 93,
        "fillRate": 91,
        "rejectRate": 5.3,
        "composite": 93
      },
      {
        "week": "W4",
        "otd": 93.7,
        "fillRate": 91.6,
        "rejectRate": 5.1,
        "composite": 93
      }
    ]
  },
  {
    "id": "S044",
    "name": "Bharat Foundries",
    "category": "Fasteners",
    "otd": 87.3,
    "fillRate": 98.3,
    "rejectRate": 9,
    "compositeScore": 92,
    "grade": "B",
    "trend": "Degrading",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 89.2,
        "fillRate": 98.6,
        "rejectRate": 8.1,
        "composite": 93
      },
      {
        "week": "W2",
        "otd": 86.7,
        "fillRate": 96,
        "rejectRate": 8.2,
        "composite": 91
      },
      {
        "week": "W3",
        "otd": 87.6,
        "fillRate": 96,
        "rejectRate": 9.3,
        "composite": 91
      },
      {
        "week": "W4",
        "otd": 88.2,
        "fillRate": 96.2,
        "rejectRate": 8.5,
        "composite": 92
      }
    ]
  },
  {
    "id": "S045",
    "name": "Neo Corp",
    "category": "Raw Material",
    "otd": 75.7,
    "fillRate": 93.7,
    "rejectRate": 5.7,
    "compositeScore": 87,
    "grade": "B",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 77.7,
        "fillRate": 94.6,
        "rejectRate": 5,
        "composite": 88
      },
      {
        "week": "W2",
        "otd": 73.8,
        "fillRate": 92.2,
        "rejectRate": 6.7,
        "composite": 85
      },
      {
        "week": "W3",
        "otd": 75.5,
        "fillRate": 95,
        "rejectRate": 6,
        "composite": 87
      },
      {
        "week": "W4",
        "otd": 74.1,
        "fillRate": 93.9,
        "rejectRate": 5.4,
        "composite": 86
      }
    ]
  },
  {
    "id": "S046",
    "name": "Tech Components",
    "category": "Yarn",
    "otd": 65.4,
    "fillRate": 92.3,
    "rejectRate": 1.7,
    "compositeScore": 83,
    "grade": "C",
    "trend": "Degrading",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 67.8,
        "fillRate": 93,
        "rejectRate": 2.4,
        "composite": 84
      },
      {
        "week": "W2",
        "otd": 65,
        "fillRate": 94.7,
        "rejectRate": 1.7,
        "composite": 84
      },
      {
        "week": "W3",
        "otd": 67.4,
        "fillRate": 93.9,
        "rejectRate": 2.6,
        "composite": 84
      },
      {
        "week": "W4",
        "otd": 67.7,
        "fillRate": 90.4,
        "rejectRate": 1,
        "composite": 84
      }
    ]
  },
  {
    "id": "S047",
    "name": "Precision Components",
    "category": "Packaging",
    "otd": 96.9,
    "fillRate": 88.2,
    "rejectRate": 1.2,
    "compositeScore": 95,
    "grade": "A",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 94.7,
        "fillRate": 89.7,
        "rejectRate": 1.5,
        "composite": 94
      },
      {
        "week": "W2",
        "otd": 94.6,
        "fillRate": 87.9,
        "rejectRate": 2.1,
        "composite": 94
      },
      {
        "week": "W3",
        "otd": 98.7,
        "fillRate": 90.4,
        "rejectRate": 2.1,
        "composite": 96
      },
      {
        "week": "W4",
        "otd": 98.9,
        "fillRate": 86.2,
        "rejectRate": 1.7,
        "composite": 95
      }
    ]
  },
  {
    "id": "S048",
    "name": "Deccan Polymers",
    "category": "Yarn",
    "otd": 67.9,
    "fillRate": 90.6,
    "rejectRate": 5.3,
    "compositeScore": 83,
    "grade": "C",
    "trend": "Erratic",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 66,
        "fillRate": 89.1,
        "rejectRate": 4.6,
        "composite": 82
      },
      {
        "week": "W2",
        "otd": 68.1,
        "fillRate": 88.8,
        "rejectRate": 5.2,
        "composite": 82
      },
      {
        "week": "W3",
        "otd": 69.1,
        "fillRate": 91.5,
        "rejectRate": 5.2,
        "composite": 84
      },
      {
        "week": "W4",
        "otd": 65.4,
        "fillRate": 88.3,
        "rejectRate": 4.5,
        "composite": 81
      }
    ]
  },
  {
    "id": "S049",
    "name": "Zenith Supplies",
    "category": "Raw Material",
    "otd": 66,
    "fillRate": 97.2,
    "rejectRate": 2.8,
    "compositeScore": 85,
    "grade": "B",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 66,
        "fillRate": 98.3,
        "rejectRate": 2.4,
        "composite": 85
      },
      {
        "week": "W2",
        "otd": 68.3,
        "fillRate": 95.7,
        "rejectRate": 1.9,
        "composite": 85
      },
      {
        "week": "W3",
        "otd": 65.8,
        "fillRate": 95.8,
        "rejectRate": 3.5,
        "composite": 84
      },
      {
        "week": "W4",
        "otd": 64.5,
        "fillRate": 97.8,
        "rejectRate": 2.7,
        "composite": 84
      }
    ]
  },
  {
    "id": "S050",
    "name": "Apex Industries",
    "category": "Components",
    "otd": 86,
    "fillRate": 99.2,
    "rejectRate": 1.5,
    "compositeScore": 94,
    "grade": "B",
    "trend": "Erratic",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 86,
        "fillRate": 100,
        "rejectRate": 1.8,
        "composite": 94
      },
      {
        "week": "W2",
        "otd": 86.5,
        "fillRate": 96.7,
        "rejectRate": 2.1,
        "composite": 93
      },
      {
        "week": "W3",
        "otd": 86.6,
        "fillRate": 100,
        "rejectRate": 1.2,
        "composite": 94
      },
      {
        "week": "W4",
        "otd": 85.8,
        "fillRate": 97,
        "rejectRate": 0.6,
        "composite": 93
      }
    ]
  },
  {
    "id": "S051",
    "name": "Elite Ltd",
    "category": "Freight/Pkg",
    "otd": 90.1,
    "fillRate": 90.2,
    "rejectRate": 7,
    "compositeScore": 91,
    "grade": "B",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 92,
        "fillRate": 88.8,
        "rejectRate": 6.9,
        "composite": 91
      },
      {
        "week": "W2",
        "otd": 92.3,
        "fillRate": 89,
        "rejectRate": 6.2,
        "composite": 92
      },
      {
        "week": "W3",
        "otd": 89.2,
        "fillRate": 87.8,
        "rejectRate": 7.4,
        "composite": 90
      },
      {
        "week": "W4",
        "otd": 91.5,
        "fillRate": 89.9,
        "rejectRate": 7.8,
        "composite": 91
      }
    ]
  },
  {
    "id": "S052",
    "name": "Zenith Ltd",
    "category": "Freight/Pkg",
    "otd": 67,
    "fillRate": 96.7,
    "rejectRate": 5.7,
    "compositeScore": 84,
    "grade": "C",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 65.3,
        "fillRate": 94.3,
        "rejectRate": 5.5,
        "composite": 83
      },
      {
        "week": "W2",
        "otd": 66,
        "fillRate": 94.4,
        "rejectRate": 5.7,
        "composite": 83
      },
      {
        "week": "W3",
        "otd": 66,
        "fillRate": 96.3,
        "rejectRate": 6.6,
        "composite": 83
      },
      {
        "week": "W4",
        "otd": 65.4,
        "fillRate": 97,
        "rejectRate": 5.1,
        "composite": 84
      }
    ]
  },
  {
    "id": "S053",
    "name": "Precision Foundries",
    "category": "Fasteners",
    "otd": 77.9,
    "fillRate": 99.3,
    "rejectRate": 5,
    "compositeScore": 89,
    "grade": "B",
    "trend": "Erratic",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 79.3,
        "fillRate": 100,
        "rejectRate": 5.4,
        "composite": 90
      },
      {
        "week": "W2",
        "otd": 78.4,
        "fillRate": 100,
        "rejectRate": 5.9,
        "composite": 90
      },
      {
        "week": "W3",
        "otd": 79.9,
        "fillRate": 97,
        "rejectRate": 4.1,
        "composite": 90
      },
      {
        "week": "W4",
        "otd": 80.4,
        "fillRate": 97.4,
        "rejectRate": 5.2,
        "composite": 90
      }
    ]
  },
  {
    "id": "S054",
    "name": "Micro Ltd",
    "category": "Components",
    "otd": 91.7,
    "fillRate": 90.5,
    "rejectRate": 3.3,
    "compositeScore": 93,
    "grade": "B",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 94,
        "fillRate": 91,
        "rejectRate": 3.7,
        "composite": 94
      },
      {
        "week": "W2",
        "otd": 90.2,
        "fillRate": 90.3,
        "rejectRate": 2.7,
        "composite": 92
      },
      {
        "week": "W3",
        "otd": 93.1,
        "fillRate": 91.7,
        "rejectRate": 4,
        "composite": 94
      },
      {
        "week": "W4",
        "otd": 93,
        "fillRate": 91.8,
        "rejectRate": 2.7,
        "composite": 94
      }
    ]
  },
  {
    "id": "S055",
    "name": "Omega Industries",
    "category": "Packaging",
    "otd": 67.5,
    "fillRate": 88.4,
    "rejectRate": 5.2,
    "compositeScore": 82,
    "grade": "C",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 66,
        "fillRate": 88,
        "rejectRate": 5.4,
        "composite": 81
      },
      {
        "week": "W2",
        "otd": 69.9,
        "fillRate": 90,
        "rejectRate": 5.3,
        "composite": 83
      },
      {
        "week": "W3",
        "otd": 68.5,
        "fillRate": 87.4,
        "rejectRate": 5.4,
        "composite": 82
      },
      {
        "week": "W4",
        "otd": 67.5,
        "fillRate": 86.7,
        "rejectRate": 5.3,
        "composite": 81
      }
    ]
  },
  {
    "id": "S056",
    "name": "Krishna Ltd",
    "category": "Freight/Pkg",
    "otd": 85.6,
    "fillRate": 92.4,
    "rejectRate": 4.3,
    "compositeScore": 91,
    "grade": "B",
    "trend": "Erratic",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 87.4,
        "fillRate": 93.5,
        "rejectRate": 5.1,
        "composite": 91
      },
      {
        "week": "W2",
        "otd": 84.1,
        "fillRate": 90.2,
        "rejectRate": 4.1,
        "composite": 89
      },
      {
        "week": "W3",
        "otd": 83.6,
        "fillRate": 93.9,
        "rejectRate": 3.8,
        "composite": 90
      },
      {
        "week": "W4",
        "otd": 88,
        "fillRate": 93.5,
        "rejectRate": 4.6,
        "composite": 92
      }
    ]
  },
  {
    "id": "S057",
    "name": "Omega Industries",
    "category": "Yarn",
    "otd": 89.4,
    "fillRate": 89.7,
    "rejectRate": 5.3,
    "compositeScore": 91,
    "grade": "B",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 89.6,
        "fillRate": 88.8,
        "rejectRate": 4.5,
        "composite": 91
      },
      {
        "week": "W2",
        "otd": 88.5,
        "fillRate": 90.7,
        "rejectRate": 5.3,
        "composite": 91
      },
      {
        "week": "W3",
        "otd": 91.8,
        "fillRate": 88.8,
        "rejectRate": 4.4,
        "composite": 92
      },
      {
        "week": "W4",
        "otd": 88.7,
        "fillRate": 91,
        "rejectRate": 5.3,
        "composite": 91
      }
    ]
  },
  {
    "id": "S058",
    "name": "Bharat Corp",
    "category": "Yarn",
    "otd": 77.4,
    "fillRate": 91.1,
    "rejectRate": 5.3,
    "compositeScore": 87,
    "grade": "B",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 79.2,
        "fillRate": 90.6,
        "rejectRate": 4.3,
        "composite": 88
      },
      {
        "week": "W2",
        "otd": 74.9,
        "fillRate": 89.2,
        "rejectRate": 5.9,
        "composite": 85
      },
      {
        "week": "W3",
        "otd": 78.3,
        "fillRate": 90.8,
        "rejectRate": 5.7,
        "composite": 87
      },
      {
        "week": "W4",
        "otd": 78.2,
        "fillRate": 90.4,
        "rejectRate": 6.3,
        "composite": 87
      }
    ]
  },
  {
    "id": "S059",
    "name": "Bharat Industries",
    "category": "Raw Material",
    "otd": 97.3,
    "fillRate": 90.9,
    "rejectRate": 5.3,
    "compositeScore": 95,
    "grade": "A",
    "trend": "Erratic",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 97.5,
        "fillRate": 91.6,
        "rejectRate": 4.4,
        "composite": 95
      },
      {
        "week": "W2",
        "otd": 95.9,
        "fillRate": 88.8,
        "rejectRate": 4.6,
        "composite": 94
      },
      {
        "week": "W3",
        "otd": 97,
        "fillRate": 88.8,
        "rejectRate": 5.7,
        "composite": 94
      },
      {
        "week": "W4",
        "otd": 98.3,
        "fillRate": 88.7,
        "rejectRate": 4.6,
        "composite": 95
      }
    ]
  },
  {
    "id": "S060",
    "name": "Neo Industries",
    "category": "Raw Material",
    "otd": 84.4,
    "fillRate": 94.3,
    "rejectRate": 3.2,
    "compositeScore": 91,
    "grade": "B",
    "trend": "Erratic",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 81.9,
        "fillRate": 93.8,
        "rejectRate": 4.1,
        "composite": 90
      },
      {
        "week": "W2",
        "otd": 82.4,
        "fillRate": 92.9,
        "rejectRate": 3.1,
        "composite": 90
      },
      {
        "week": "W3",
        "otd": 85.4,
        "fillRate": 94.1,
        "rejectRate": 2.3,
        "composite": 92
      },
      {
        "week": "W4",
        "otd": 82.9,
        "fillRate": 93.5,
        "rejectRate": 3.3,
        "composite": 90
      }
    ]
  },
  {
    "id": "S061",
    "name": "Elite Ltd",
    "category": "Components",
    "otd": 71.5,
    "fillRate": 91.9,
    "rejectRate": 2.1,
    "compositeScore": 86,
    "grade": "B",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 71.4,
        "fillRate": 92.1,
        "rejectRate": 2.4,
        "composite": 85
      },
      {
        "week": "W2",
        "otd": 71.6,
        "fillRate": 91.4,
        "rejectRate": 2.6,
        "composite": 85
      },
      {
        "week": "W3",
        "otd": 72.3,
        "fillRate": 92.3,
        "rejectRate": 2.2,
        "composite": 86
      },
      {
        "week": "W4",
        "otd": 71.8,
        "fillRate": 92.1,
        "rejectRate": 2.4,
        "composite": 86
      }
    ]
  },
  {
    "id": "S062",
    "name": "Apex Supplies",
    "category": "Raw Material",
    "otd": 92.5,
    "fillRate": 93.1,
    "rejectRate": 4.6,
    "compositeScore": 94,
    "grade": "B",
    "trend": "Degrading",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 92.1,
        "fillRate": 90.8,
        "rejectRate": 3.8,
        "composite": 93
      },
      {
        "week": "W2",
        "otd": 91.5,
        "fillRate": 90.9,
        "rejectRate": 4.5,
        "composite": 93
      },
      {
        "week": "W3",
        "otd": 94.7,
        "fillRate": 92.3,
        "rejectRate": 4,
        "composite": 94
      },
      {
        "week": "W4",
        "otd": 90.2,
        "fillRate": 93.2,
        "rejectRate": 4.4,
        "composite": 93
      }
    ]
  },
  {
    "id": "S063",
    "name": "Elite Foundries",
    "category": "Raw Material",
    "otd": 84.2,
    "fillRate": 98.5,
    "rejectRate": 6.5,
    "compositeScore": 91,
    "grade": "B",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 83.3,
        "fillRate": 99.7,
        "rejectRate": 5.9,
        "composite": 91
      },
      {
        "week": "W2",
        "otd": 86.5,
        "fillRate": 100,
        "rejectRate": 6.8,
        "composite": 93
      },
      {
        "week": "W3",
        "otd": 82.5,
        "fillRate": 100,
        "rejectRate": 6.8,
        "composite": 91
      },
      {
        "week": "W4",
        "otd": 84.6,
        "fillRate": 99.1,
        "rejectRate": 7.1,
        "composite": 91
      }
    ]
  },
  {
    "id": "S064",
    "name": "United Corp",
    "category": "Freight/Pkg",
    "otd": 81.6,
    "fillRate": 91.8,
    "rejectRate": 4.9,
    "compositeScore": 89,
    "grade": "B",
    "trend": "Erratic",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 82.7,
        "fillRate": 90.9,
        "rejectRate": 4.8,
        "composite": 89
      },
      {
        "week": "W2",
        "otd": 79.3,
        "fillRate": 91.6,
        "rejectRate": 5.2,
        "composite": 88
      },
      {
        "week": "W3",
        "otd": 82.4,
        "fillRate": 94.1,
        "rejectRate": 5.9,
        "composite": 89
      },
      {
        "week": "W4",
        "otd": 82,
        "fillRate": 92.2,
        "rejectRate": 4.8,
        "composite": 89
      }
    ]
  },
  {
    "id": "S065",
    "name": "Apex Industries",
    "category": "Yarn",
    "otd": 88.8,
    "fillRate": 99.5,
    "rejectRate": 8.9,
    "compositeScore": 93,
    "grade": "B",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 87.6,
        "fillRate": 97.8,
        "rejectRate": 9.9,
        "composite": 91
      },
      {
        "week": "W2",
        "otd": 87.7,
        "fillRate": 99.2,
        "rejectRate": 9.3,
        "composite": 92
      },
      {
        "week": "W3",
        "otd": 87.6,
        "fillRate": 99,
        "rejectRate": 8.2,
        "composite": 92
      },
      {
        "week": "W4",
        "otd": 86.4,
        "fillRate": 100,
        "rejectRate": 8.5,
        "composite": 92
      }
    ]
  },
  {
    "id": "S066",
    "name": "Elite Polymers",
    "category": "Components",
    "otd": 70.7,
    "fillRate": 94.2,
    "rejectRate": 0.1,
    "compositeScore": 87,
    "grade": "B",
    "trend": "Degrading",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 72.5,
        "fillRate": 93.3,
        "rejectRate": 0,
        "composite": 87
      },
      {
        "week": "W2",
        "otd": 69.3,
        "fillRate": 93.3,
        "rejectRate": 0.3,
        "composite": 86
      },
      {
        "week": "W3",
        "otd": 70.2,
        "fillRate": 95.4,
        "rejectRate": 0,
        "composite": 87
      },
      {
        "week": "W4",
        "otd": 69.3,
        "fillRate": 95,
        "rejectRate": 0,
        "composite": 86
      }
    ]
  },
  {
    "id": "S067",
    "name": "Micro Ltd",
    "category": "Packaging",
    "otd": 83.7,
    "fillRate": 87.9,
    "rejectRate": 3.9,
    "compositeScore": 89,
    "grade": "B",
    "trend": "Degrading",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 84.5,
        "fillRate": 86.4,
        "rejectRate": 4.5,
        "composite": 88
      },
      {
        "week": "W2",
        "otd": 86.2,
        "fillRate": 88.4,
        "rejectRate": 3,
        "composite": 90
      },
      {
        "week": "W3",
        "otd": 85.1,
        "fillRate": 89.3,
        "rejectRate": 3.3,
        "composite": 90
      },
      {
        "week": "W4",
        "otd": 86,
        "fillRate": 88.3,
        "rejectRate": 4.8,
        "composite": 89
      }
    ]
  },
  {
    "id": "S068",
    "name": "Krishna Industries",
    "category": "Packaging",
    "otd": 86.4,
    "fillRate": 97,
    "rejectRate": 7.6,
    "compositeScore": 91,
    "grade": "B",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 85.5,
        "fillRate": 99.2,
        "rejectRate": 7.2,
        "composite": 92
      },
      {
        "week": "W2",
        "otd": 87,
        "fillRate": 95.4,
        "rejectRate": 7.3,
        "composite": 91
      },
      {
        "week": "W3",
        "otd": 87.7,
        "fillRate": 98.9,
        "rejectRate": 6.9,
        "composite": 93
      },
      {
        "week": "W4",
        "otd": 87.2,
        "fillRate": 95.5,
        "rejectRate": 8.3,
        "composite": 91
      }
    ]
  },
  {
    "id": "S069",
    "name": "Standard Industries",
    "category": "Fasteners",
    "otd": 73.9,
    "fillRate": 96.1,
    "rejectRate": 2.7,
    "compositeScore": 88,
    "grade": "B",
    "trend": "Degrading",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 73.4,
        "fillRate": 94.9,
        "rejectRate": 3.1,
        "composite": 87
      },
      {
        "week": "W2",
        "otd": 72.7,
        "fillRate": 94.7,
        "rejectRate": 2.7,
        "composite": 87
      },
      {
        "week": "W3",
        "otd": 72.4,
        "fillRate": 98.3,
        "rejectRate": 3.1,
        "composite": 88
      },
      {
        "week": "W4",
        "otd": 72.8,
        "fillRate": 96.1,
        "rejectRate": 1.8,
        "composite": 87
      }
    ]
  },
  {
    "id": "S070",
    "name": "Precision Foundries",
    "category": "Yarn",
    "otd": 87.3,
    "fillRate": 96.1,
    "rejectRate": 8.7,
    "compositeScore": 91,
    "grade": "B",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 87.5,
        "fillRate": 96.8,
        "rejectRate": 8,
        "composite": 92
      },
      {
        "week": "W2",
        "otd": 87.4,
        "fillRate": 98.2,
        "rejectRate": 7.8,
        "composite": 92
      },
      {
        "week": "W3",
        "otd": 88.3,
        "fillRate": 96.8,
        "rejectRate": 8.9,
        "composite": 92
      },
      {
        "week": "W4",
        "otd": 88.4,
        "fillRate": 93.7,
        "rejectRate": 8.3,
        "composite": 91
      }
    ]
  },
  {
    "id": "S071",
    "name": "Deccan Components",
    "category": "Fasteners",
    "otd": 70.9,
    "fillRate": 93.6,
    "rejectRate": 0.6,
    "compositeScore": 86,
    "grade": "B",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 73.2,
        "fillRate": 91.8,
        "rejectRate": 0.2,
        "composite": 87
      },
      {
        "week": "W2",
        "otd": 70.5,
        "fillRate": 91.4,
        "rejectRate": 1.5,
        "composite": 85
      },
      {
        "week": "W3",
        "otd": 71.4,
        "fillRate": 93,
        "rejectRate": 0.3,
        "composite": 86
      },
      {
        "week": "W4",
        "otd": 68.9,
        "fillRate": 91.6,
        "rejectRate": 0,
        "composite": 85
      }
    ]
  },
  {
    "id": "S072",
    "name": "Krishna Ltd",
    "category": "Fasteners",
    "otd": 74.5,
    "fillRate": 97.5,
    "rejectRate": 7.8,
    "compositeScore": 87,
    "grade": "B",
    "trend": "Degrading",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 76.8,
        "fillRate": 98.1,
        "rejectRate": 8.5,
        "composite": 88
      },
      {
        "week": "W2",
        "otd": 72.8,
        "fillRate": 98.7,
        "rejectRate": 8.8,
        "composite": 86
      },
      {
        "week": "W3",
        "otd": 74.1,
        "fillRate": 95,
        "rejectRate": 7.1,
        "composite": 86
      },
      {
        "week": "W4",
        "otd": 75.6,
        "fillRate": 98.7,
        "rejectRate": 7.8,
        "composite": 88
      }
    ]
  },
  {
    "id": "S073",
    "name": "United Components",
    "category": "Packaging",
    "otd": 77.9,
    "fillRate": 95,
    "rejectRate": 2.9,
    "compositeScore": 89,
    "grade": "B",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 77.6,
        "fillRate": 95.7,
        "rejectRate": 2.4,
        "composite": 89
      },
      {
        "week": "W2",
        "otd": 76.9,
        "fillRate": 93.6,
        "rejectRate": 3.4,
        "composite": 88
      },
      {
        "week": "W3",
        "otd": 79.6,
        "fillRate": 96,
        "rejectRate": 3.7,
        "composite": 90
      },
      {
        "week": "W4",
        "otd": 76.3,
        "fillRate": 97.5,
        "rejectRate": 3.4,
        "composite": 89
      }
    ]
  },
  {
    "id": "S074",
    "name": "Prime Corp",
    "category": "Components",
    "otd": 68.3,
    "fillRate": 93.8,
    "rejectRate": 6.3,
    "compositeScore": 84,
    "grade": "C",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 70.2,
        "fillRate": 93.8,
        "rejectRate": 6,
        "composite": 84
      },
      {
        "week": "W2",
        "otd": 69.9,
        "fillRate": 94.4,
        "rejectRate": 6.5,
        "composite": 84
      },
      {
        "week": "W3",
        "otd": 66.6,
        "fillRate": 94.6,
        "rejectRate": 5.3,
        "composite": 83
      },
      {
        "week": "W4",
        "otd": 67,
        "fillRate": 93.2,
        "rejectRate": 5.7,
        "composite": 83
      }
    ]
  },
  {
    "id": "S075",
    "name": "Precision Ltd",
    "category": "Packaging",
    "otd": 69.7,
    "fillRate": 92.1,
    "rejectRate": 8.2,
    "compositeScore": 83,
    "grade": "C",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 71.6,
        "fillRate": 91.6,
        "rejectRate": 7.4,
        "composite": 84
      },
      {
        "week": "W2",
        "otd": 70,
        "fillRate": 94.4,
        "rejectRate": 7.7,
        "composite": 84
      },
      {
        "week": "W3",
        "otd": 69.3,
        "fillRate": 91.9,
        "rejectRate": 8,
        "composite": 83
      },
      {
        "week": "W4",
        "otd": 71.5,
        "fillRate": 93.2,
        "rejectRate": 7.4,
        "composite": 84
      }
    ]
  },
  {
    "id": "S076",
    "name": "Krishna Ltd",
    "category": "Packaging",
    "otd": 78.5,
    "fillRate": 85.4,
    "rejectRate": 1.5,
    "compositeScore": 87,
    "grade": "B",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 76.4,
        "fillRate": 86.1,
        "rejectRate": 0.6,
        "composite": 86
      },
      {
        "week": "W2",
        "otd": 78.4,
        "fillRate": 83,
        "rejectRate": 1.9,
        "composite": 86
      },
      {
        "week": "W3",
        "otd": 79.4,
        "fillRate": 86.6,
        "rejectRate": 1.4,
        "composite": 87
      },
      {
        "week": "W4",
        "otd": 78.3,
        "fillRate": 85.3,
        "rejectRate": 1.4,
        "composite": 86
      }
    ]
  },
  {
    "id": "S077",
    "name": "United Ltd",
    "category": "Packaging",
    "otd": 75.1,
    "fillRate": 98.3,
    "rejectRate": 5.1,
    "compositeScore": 88,
    "grade": "B",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 76.9,
        "fillRate": 97.9,
        "rejectRate": 4.8,
        "composite": 89
      },
      {
        "week": "W2",
        "otd": 74.7,
        "fillRate": 100,
        "rejectRate": 6,
        "composite": 88
      },
      {
        "week": "W3",
        "otd": 73,
        "fillRate": 97.5,
        "rejectRate": 5.1,
        "composite": 87
      },
      {
        "week": "W4",
        "otd": 76.9,
        "fillRate": 99.8,
        "rejectRate": 5.2,
        "composite": 89
      }
    ]
  },
  {
    "id": "S078",
    "name": "Alpha Supplies",
    "category": "Freight/Pkg",
    "otd": 90.7,
    "fillRate": 96.1,
    "rejectRate": 7.8,
    "compositeScore": 93,
    "grade": "B",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 90.1,
        "fillRate": 94.9,
        "rejectRate": 8.6,
        "composite": 92
      },
      {
        "week": "W2",
        "otd": 92,
        "fillRate": 93.6,
        "rejectRate": 6.8,
        "composite": 93
      },
      {
        "week": "W3",
        "otd": 89.1,
        "fillRate": 95,
        "rejectRate": 8.2,
        "composite": 92
      },
      {
        "week": "W4",
        "otd": 88.9,
        "fillRate": 97,
        "rejectRate": 8.1,
        "composite": 92
      }
    ]
  },
  {
    "id": "S079",
    "name": "Elite Corp",
    "category": "Packaging",
    "otd": 88.1,
    "fillRate": 87.7,
    "rejectRate": 5.9,
    "compositeScore": 90,
    "grade": "B",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 89.9,
        "fillRate": 85.6,
        "rejectRate": 5.5,
        "composite": 90
      },
      {
        "week": "W2",
        "otd": 87.3,
        "fillRate": 90.2,
        "rejectRate": 5.3,
        "composite": 90
      },
      {
        "week": "W3",
        "otd": 86.4,
        "fillRate": 90.2,
        "rejectRate": 6.5,
        "composite": 90
      },
      {
        "week": "W4",
        "otd": 89.2,
        "fillRate": 89.4,
        "rejectRate": 5.3,
        "composite": 91
      }
    ]
  },
  {
    "id": "S080",
    "name": "Alpha Industries",
    "category": "Fasteners",
    "otd": 91.5,
    "fillRate": 92.4,
    "rejectRate": 2.6,
    "compositeScore": 94,
    "grade": "B",
    "trend": "Erratic",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 91,
        "fillRate": 92.4,
        "rejectRate": 3.2,
        "composite": 93
      },
      {
        "week": "W2",
        "otd": 92.4,
        "fillRate": 90.8,
        "rejectRate": 3.2,
        "composite": 93
      },
      {
        "week": "W3",
        "otd": 91.9,
        "fillRate": 93.7,
        "rejectRate": 3.2,
        "composite": 94
      },
      {
        "week": "W4",
        "otd": 91.1,
        "fillRate": 91.9,
        "rejectRate": 2.1,
        "composite": 93
      }
    ]
  },
  {
    "id": "S081",
    "name": "Bharat Supplies",
    "category": "Fasteners",
    "otd": 79.6,
    "fillRate": 89.3,
    "rejectRate": 0.6,
    "compositeScore": 88,
    "grade": "B",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 81.7,
        "fillRate": 90.2,
        "rejectRate": 0.5,
        "composite": 90
      },
      {
        "week": "W2",
        "otd": 80.3,
        "fillRate": 88.4,
        "rejectRate": 0,
        "composite": 89
      },
      {
        "week": "W3",
        "otd": 80,
        "fillRate": 89.9,
        "rejectRate": 0.3,
        "composite": 89
      },
      {
        "week": "W4",
        "otd": 80.7,
        "fillRate": 87.5,
        "rejectRate": 1.5,
        "composite": 88
      }
    ]
  },
  {
    "id": "S082",
    "name": "Swift Supplies",
    "category": "Freight/Pkg",
    "otd": 76.2,
    "fillRate": 97.7,
    "rejectRate": 7.5,
    "compositeScore": 88,
    "grade": "B",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 76.1,
        "fillRate": 99.7,
        "rejectRate": 7.4,
        "composite": 88
      },
      {
        "week": "W2",
        "otd": 77.6,
        "fillRate": 99.3,
        "rejectRate": 7.4,
        "composite": 89
      },
      {
        "week": "W3",
        "otd": 77.9,
        "fillRate": 98,
        "rejectRate": 6.7,
        "composite": 89
      },
      {
        "week": "W4",
        "otd": 74.4,
        "fillRate": 98.9,
        "rejectRate": 6.8,
        "composite": 87
      }
    ]
  },
  {
    "id": "S083",
    "name": "Prime Foundries",
    "category": "Yarn",
    "otd": 84.4,
    "fillRate": 96.3,
    "rejectRate": 6.1,
    "compositeScore": 91,
    "grade": "B",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 82.9,
        "fillRate": 97.2,
        "rejectRate": 5.5,
        "composite": 91
      },
      {
        "week": "W2",
        "otd": 82.2,
        "fillRate": 95.8,
        "rejectRate": 5.2,
        "composite": 90
      },
      {
        "week": "W3",
        "otd": 86.4,
        "fillRate": 94.4,
        "rejectRate": 6.2,
        "composite": 91
      },
      {
        "week": "W4",
        "otd": 82,
        "fillRate": 97,
        "rejectRate": 6.4,
        "composite": 90
      }
    ]
  },
  {
    "id": "S084",
    "name": "United Foundries",
    "category": "Yarn",
    "otd": 85.8,
    "fillRate": 94.6,
    "rejectRate": 8,
    "compositeScore": 90,
    "grade": "B",
    "trend": "Degrading",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 84.6,
        "fillRate": 95.7,
        "rejectRate": 8,
        "composite": 90
      },
      {
        "week": "W2",
        "otd": 84,
        "fillRate": 96.8,
        "rejectRate": 8,
        "composite": 90
      },
      {
        "week": "W3",
        "otd": 87.2,
        "fillRate": 95.8,
        "rejectRate": 8.2,
        "composite": 91
      },
      {
        "week": "W4",
        "otd": 84.8,
        "fillRate": 95.8,
        "rejectRate": 8.7,
        "composite": 90
      }
    ]
  },
  {
    "id": "S085",
    "name": "Apex Polymers",
    "category": "Components",
    "otd": 93,
    "fillRate": 89,
    "rejectRate": 3.4,
    "compositeScore": 93,
    "grade": "B",
    "trend": "Degrading",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 92.3,
        "fillRate": 87.4,
        "rejectRate": 3.7,
        "composite": 92
      },
      {
        "week": "W2",
        "otd": 95.3,
        "fillRate": 87.4,
        "rejectRate": 3.5,
        "composite": 93
      },
      {
        "week": "W3",
        "otd": 94.1,
        "fillRate": 91.2,
        "rejectRate": 2.9,
        "composite": 94
      },
      {
        "week": "W4",
        "otd": 92.5,
        "fillRate": 88.4,
        "rejectRate": 3.2,
        "composite": 93
      }
    ]
  },
  {
    "id": "S086",
    "name": "Zenith Ltd",
    "category": "Yarn",
    "otd": 67.8,
    "fillRate": 92.9,
    "rejectRate": 7.4,
    "compositeScore": 83,
    "grade": "C",
    "trend": "Degrading",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 69.4,
        "fillRate": 90.9,
        "rejectRate": 7.6,
        "composite": 83
      },
      {
        "week": "W2",
        "otd": 67.2,
        "fillRate": 92,
        "rejectRate": 7.8,
        "composite": 82
      },
      {
        "week": "W3",
        "otd": 69.1,
        "fillRate": 94.6,
        "rejectRate": 6.7,
        "composite": 84
      },
      {
        "week": "W4",
        "otd": 68.2,
        "fillRate": 92.7,
        "rejectRate": 6.6,
        "composite": 83
      }
    ]
  },
  {
    "id": "S087",
    "name": "Swift Corp",
    "category": "Raw Material",
    "otd": 74.1,
    "fillRate": 86.3,
    "rejectRate": 4.8,
    "compositeScore": 84,
    "grade": "C",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 74.9,
        "fillRate": 84.4,
        "rejectRate": 4.4,
        "composite": 84
      },
      {
        "week": "W2",
        "otd": 75.2,
        "fillRate": 87.1,
        "rejectRate": 4.2,
        "composite": 85
      },
      {
        "week": "W3",
        "otd": 74.9,
        "fillRate": 88.5,
        "rejectRate": 5,
        "composite": 85
      },
      {
        "week": "W4",
        "otd": 75.6,
        "fillRate": 85.4,
        "rejectRate": 4.4,
        "composite": 85
      }
    ]
  },
  {
    "id": "S088",
    "name": "Neo Corp",
    "category": "Yarn",
    "otd": 81,
    "fillRate": 99.2,
    "rejectRate": 0.7,
    "compositeScore": 92,
    "grade": "B",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 79.6,
        "fillRate": 97.8,
        "rejectRate": 1.5,
        "composite": 91
      },
      {
        "week": "W2",
        "otd": 81.1,
        "fillRate": 98.4,
        "rejectRate": 0.8,
        "composite": 92
      },
      {
        "week": "W3",
        "otd": 82.1,
        "fillRate": 99.6,
        "rejectRate": 1.2,
        "composite": 92
      },
      {
        "week": "W4",
        "otd": 82.7,
        "fillRate": 99.2,
        "rejectRate": 0.6,
        "composite": 93
      }
    ]
  },
  {
    "id": "S089",
    "name": "Alpha Polymers",
    "category": "Yarn",
    "otd": 75.9,
    "fillRate": 85.4,
    "rejectRate": 4,
    "compositeScore": 85,
    "grade": "B",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 77,
        "fillRate": 85.8,
        "rejectRate": 4.5,
        "composite": 85
      },
      {
        "week": "W2",
        "otd": 76,
        "fillRate": 87.2,
        "rejectRate": 5,
        "composite": 85
      },
      {
        "week": "W3",
        "otd": 77.7,
        "fillRate": 85.3,
        "rejectRate": 3.1,
        "composite": 86
      },
      {
        "week": "W4",
        "otd": 74.8,
        "fillRate": 85.9,
        "rejectRate": 4.8,
        "composite": 84
      }
    ]
  },
  {
    "id": "S090",
    "name": "Bharat Ltd",
    "category": "Raw Material",
    "otd": 66.3,
    "fillRate": 88.4,
    "rejectRate": 4.6,
    "compositeScore": 82,
    "grade": "C",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 65.4,
        "fillRate": 88.6,
        "rejectRate": 5.5,
        "composite": 81
      },
      {
        "week": "W2",
        "otd": 64.7,
        "fillRate": 87.4,
        "rejectRate": 4,
        "composite": 81
      },
      {
        "week": "W3",
        "otd": 64.7,
        "fillRate": 86.2,
        "rejectRate": 4.9,
        "composite": 80
      },
      {
        "week": "W4",
        "otd": 64.3,
        "fillRate": 88.2,
        "rejectRate": 5.5,
        "composite": 81
      }
    ]
  },
  {
    "id": "S091",
    "name": "Krishna Supplies",
    "category": "Fasteners",
    "otd": 84.7,
    "fillRate": 95.5,
    "rejectRate": 9,
    "compositeScore": 90,
    "grade": "B",
    "trend": "Erratic",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 85.6,
        "fillRate": 95.6,
        "rejectRate": 9,
        "composite": 90
      },
      {
        "week": "W2",
        "otd": 84,
        "fillRate": 94.2,
        "rejectRate": 10,
        "composite": 89
      },
      {
        "week": "W3",
        "otd": 84.9,
        "fillRate": 96.9,
        "rejectRate": 9.4,
        "composite": 90
      },
      {
        "week": "W4",
        "otd": 83,
        "fillRate": 96.9,
        "rejectRate": 9.3,
        "composite": 89
      }
    ]
  },
  {
    "id": "S092",
    "name": "Standard Foundries",
    "category": "Fasteners",
    "otd": 89.3,
    "fillRate": 92.5,
    "rejectRate": 1.3,
    "compositeScore": 93,
    "grade": "B",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 88.2,
        "fillRate": 94,
        "rejectRate": 0.7,
        "composite": 93
      },
      {
        "week": "W2",
        "otd": 87.6,
        "fillRate": 93.5,
        "rejectRate": 1.7,
        "composite": 93
      },
      {
        "week": "W3",
        "otd": 90.6,
        "fillRate": 92.2,
        "rejectRate": 0.8,
        "composite": 94
      },
      {
        "week": "W4",
        "otd": 90.3,
        "fillRate": 94.4,
        "rejectRate": 0.9,
        "composite": 94
      }
    ]
  },
  {
    "id": "S093",
    "name": "Neo Foundries",
    "category": "Raw Material",
    "otd": 93,
    "fillRate": 99.2,
    "rejectRate": 1.9,
    "compositeScore": 96,
    "grade": "A",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 91.6,
        "fillRate": 98.7,
        "rejectRate": 1.6,
        "composite": 96
      },
      {
        "week": "W2",
        "otd": 92.4,
        "fillRate": 98.1,
        "rejectRate": 2.4,
        "composite": 96
      },
      {
        "week": "W3",
        "otd": 93.4,
        "fillRate": 99.9,
        "rejectRate": 1.9,
        "composite": 97
      },
      {
        "week": "W4",
        "otd": 94.5,
        "fillRate": 97.7,
        "rejectRate": 1.3,
        "composite": 97
      }
    ]
  },
  {
    "id": "S094",
    "name": "Standard Components",
    "category": "Components",
    "otd": 66.5,
    "fillRate": 92.6,
    "rejectRate": 2.3,
    "compositeScore": 84,
    "grade": "C",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 66.5,
        "fillRate": 91.2,
        "rejectRate": 3,
        "composite": 83
      },
      {
        "week": "W2",
        "otd": 68.6,
        "fillRate": 91,
        "rejectRate": 1.3,
        "composite": 84
      },
      {
        "week": "W3",
        "otd": 65,
        "fillRate": 91.5,
        "rejectRate": 3.3,
        "composite": 82
      },
      {
        "week": "W4",
        "otd": 64.3,
        "fillRate": 91.9,
        "rejectRate": 2.9,
        "composite": 82
      }
    ]
  },
  {
    "id": "S095",
    "name": "Prime Industries",
    "category": "Fasteners",
    "otd": 81.5,
    "fillRate": 92.4,
    "rejectRate": 0.7,
    "compositeScore": 90,
    "grade": "B",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 82.1,
        "fillRate": 92.7,
        "rejectRate": 0,
        "composite": 91
      },
      {
        "week": "W2",
        "otd": 83.5,
        "fillRate": 92.7,
        "rejectRate": 1.7,
        "composite": 91
      },
      {
        "week": "W3",
        "otd": 80.2,
        "fillRate": 93.9,
        "rejectRate": 1.7,
        "composite": 90
      },
      {
        "week": "W4",
        "otd": 83.3,
        "fillRate": 91.5,
        "rejectRate": 1.1,
        "composite": 90
      }
    ]
  },
  {
    "id": "S096",
    "name": "Global Corp",
    "category": "Yarn",
    "otd": 77.9,
    "fillRate": 91.3,
    "rejectRate": 0.6,
    "compositeScore": 88,
    "grade": "B",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 77,
        "fillRate": 89.9,
        "rejectRate": 0.6,
        "composite": 88
      },
      {
        "week": "W2",
        "otd": 75.7,
        "fillRate": 90.5,
        "rejectRate": 0.7,
        "composite": 87
      },
      {
        "week": "W3",
        "otd": 78.2,
        "fillRate": 93.7,
        "rejectRate": 1.1,
        "composite": 89
      },
      {
        "week": "W4",
        "otd": 79.3,
        "fillRate": 92,
        "rejectRate": 0.8,
        "composite": 89
      }
    ]
  },
  {
    "id": "S097",
    "name": "National Components",
    "category": "Fasteners",
    "otd": 78.3,
    "fillRate": 96.7,
    "rejectRate": 1.8,
    "compositeScore": 90,
    "grade": "B",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 77.2,
        "fillRate": 95.1,
        "rejectRate": 1.4,
        "composite": 89
      },
      {
        "week": "W2",
        "otd": 79.5,
        "fillRate": 95.1,
        "rejectRate": 2.4,
        "composite": 90
      },
      {
        "week": "W3",
        "otd": 76.6,
        "fillRate": 98.8,
        "rejectRate": 2.4,
        "composite": 90
      },
      {
        "week": "W4",
        "otd": 79.6,
        "fillRate": 95.7,
        "rejectRate": 1.6,
        "composite": 90
      }
    ]
  },
  {
    "id": "S098",
    "name": "Deccan Foundries",
    "category": "Yarn",
    "otd": 81.2,
    "fillRate": 98,
    "rejectRate": 3.1,
    "compositeScore": 91,
    "grade": "B",
    "trend": "Erratic",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 80.5,
        "fillRate": 96.7,
        "rejectRate": 3.7,
        "composite": 90
      },
      {
        "week": "W2",
        "otd": 81.4,
        "fillRate": 97.1,
        "rejectRate": 3,
        "composite": 91
      },
      {
        "week": "W3",
        "otd": 80,
        "fillRate": 96.6,
        "rejectRate": 3.9,
        "composite": 90
      },
      {
        "week": "W4",
        "otd": 82.3,
        "fillRate": 97.3,
        "rejectRate": 2.1,
        "composite": 91
      }
    ]
  },
  {
    "id": "S099",
    "name": "Zenith Corp",
    "category": "Freight/Pkg",
    "otd": 76.9,
    "fillRate": 85.5,
    "rejectRate": 7.4,
    "compositeScore": 84,
    "grade": "C",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 77.5,
        "fillRate": 84.9,
        "rejectRate": 6.9,
        "composite": 84
      },
      {
        "week": "W2",
        "otd": 74.6,
        "fillRate": 83.7,
        "rejectRate": 7.8,
        "composite": 83
      },
      {
        "week": "W3",
        "otd": 75.1,
        "fillRate": 86,
        "rejectRate": 6.6,
        "composite": 84
      },
      {
        "week": "W4",
        "otd": 75.4,
        "fillRate": 87.2,
        "rejectRate": 7.7,
        "composite": 84
      }
    ]
  },
  {
    "id": "S100",
    "name": "Alpha Supplies",
    "category": "Raw Material",
    "otd": 95.8,
    "fillRate": 86.7,
    "rejectRate": 6,
    "compositeScore": 93,
    "grade": "B",
    "trend": "Stable",
    "weeklyScores": [
      {
        "week": "W1",
        "otd": 95.1,
        "fillRate": 84.7,
        "rejectRate": 5.6,
        "composite": 92
      },
      {
        "week": "W2",
        "otd": 95.1,
        "fillRate": 86.5,
        "rejectRate": 5.5,
        "composite": 92
      },
      {
        "week": "W3",
        "otd": 98.1,
        "fillRate": 86.4,
        "rejectRate": 5.6,
        "composite": 93
      },
      {
        "week": "W4",
        "otd": 96.1,
        "fillRate": 85.2,
        "rejectRate": 6.7,
        "composite": 92
      }
    ]
  }
];
