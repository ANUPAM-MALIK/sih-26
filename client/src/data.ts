export type Project = {
  id: string;
  name: string;
  code: string;
  state: string;
  district: string;
  ministry: string;
  type: string;
  progress: number;
  status: string;
  area: number;
  notified: number;
  acquired: number;
  compensation: number;
  families: number;
  risk: string;
  target: string;
};

export type Parcel = {
  id: string;
  survey: string;
  village: string;
  district: string;
  state: string;
  area: number;
  status: string;
  project: string;
  coords: [number, number][];
};

export const projects: Project[] = [
  {
    id: "PRJ-2026-001",
    name: "NH-44 Expansion Project",
    code: "NHAI-HR-044",
    state: "Haryana",
    district: "Gurugram",
    ministry: "Ministry of Road Transport",
    type: "Highway",
    progress: 68,
    status: "In progress",
    area: 842,
    notified: 760,
    acquired: 568,
    compensation: 72,
    families: 318,
    risk: "Medium",
    target: "30 Nov 2026",
  },
  {
    id: "PRJ-2026-002",
    name: "Delhi–Mumbai Expressway Section",
    code: "NHAI-RJ-112",
    state: "Rajasthan",
    district: "Dausa",
    ministry: "Ministry of Road Transport",
    type: "Highway",
    progress: 82,
    status: "On track",
    area: 1250,
    notified: 1190,
    acquired: 1025,
    compensation: 88,
    families: 476,
    risk: "Low",
    target: "18 Dec 2026",
  },
  {
    id: "PRJ-2026-003",
    name: "Industrial Corridor Development",
    code: "NICDC-MH-019",
    state: "Maharashtra",
    district: "Nashik",
    ministry: "Ministry of Commerce",
    type: "Industrial",
    progress: 44,
    status: "At risk",
    area: 610,
    notified: 410,
    acquired: 268,
    compensation: 41,
    families: 219,
    risk: "High",
    target: "15 Oct 2026",
  },
  {
    id: "PRJ-2026-004",
    name: "Regional Rail Connectivity Project",
    code: "RAIL-PB-207",
    state: "Punjab",
    district: "Ludhiana",
    ministry: "Ministry of Railways",
    type: "Railway",
    progress: 56,
    status: "Under scrutiny",
    area: 390,
    notified: 280,
    acquired: 205,
    compensation: 57,
    families: 144,
    risk: "Medium",
    target: "22 Jan 2027",
  },
  {
    id: "PRJ-2026-005",
    name: "Solar Energy Park Development",
    code: "SECI-GJ-044",
    state: "Gujarat",
    district: "Kutch",
    ministry: "Ministry of New & Renewable Energy",
    type: "Energy",
    progress: 91,
    status: "On track",
    area: 1740,
    notified: 1740,
    acquired: 1615,
    compensation: 94,
    families: 602,
    risk: "Low",
    target: "12 Sep 2026",
  },
];

export const parcels: Parcel[] = [
  {
    id: "HR-GGN-00128",
    survey: "102/3",
    village: "Badshahpur",
    district: "Gurugram",
    state: "Haryana",
    area: 2.43,
    status: "ACQUIRED",
    project: "PRJ-2026-001",
    coords: [
      [28.374, 76.956],
      [28.378, 76.962],
      [28.373, 76.968],
      [28.369, 76.961],
    ],
  },
  {
    id: "HR-GGN-00129",
    survey: "102/4",
    village: "Badshahpur",
    district: "Gurugram",
    state: "Haryana",
    area: 1.86,
    status: "NOTIFIED",
    project: "PRJ-2026-001",
    coords: [
      [28.38, 76.954],
      [28.385, 76.96],
      [28.381, 76.967],
      [28.376, 76.96],
    ],
  },
  {
    id: "RJ-DSA-00441",
    survey: "44/7",
    village: "Sikandra",
    district: "Dausa",
    state: "Rajasthan",
    area: 4.12,
    status: "ACQUIRED",
    project: "PRJ-2026-002",
    coords: [
      [26.86, 76.47],
      [26.866, 76.475],
      [26.862, 76.482],
      [26.856, 76.478],
    ],
  },
  {
    id: "MH-NSK-00987",
    survey: "44/3",
    village: "Shivde",
    district: "Nashik",
    state: "Maharashtra",
    area: 3.2,
    status: "PROPOSED",
    project: "PRJ-2026-003",
    coords: [
      [20.05, 73.85],
      [20.06, 73.86],
      [20.054, 73.872],
      [20.045, 73.865],
    ],
  },
  {
    id: "PB-LDH-00421",
    survey: "118/2A",
    village: "Kaddon",
    district: "Ludhiana",
    state: "Punjab",
    area: 5.0,
    status: "VERIFIED",
    project: "PRJ-2026-004",
    coords: [
      [30.92, 75.78],
      [30.925, 75.79],
      [30.918, 75.797],
      [30.913, 75.788],
    ],
  },
];

export const states = [
  ["Haryana", 18],
  ["Rajasthan", 14],
  ["Maharashtra", 12],
  ["Punjab", 9],
  ["Gujarat", 8],
  ["Uttar Pradesh", 7],
];
