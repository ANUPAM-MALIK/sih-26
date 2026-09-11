const projects = [
  {
    id: "p1",
    projectId: "NLP-PB-RLY-014",
    name: "Ludhiana–Delhi Freight Corridor",
    department: "Ministry of Railways",
    type: "Railway",
    state: "Punjab",
    district: "Ludhiana",
    status: "In Progress",
    progress: 68,
    cases: 8,
    targetDate: "30 Nov 2026",
  },
  {
    id: "p2",
    projectId: "NHAI-MH-EXP-027",
    name: "Mumbai–Nagpur Expressway Extension",
    department: "Ministry of Road Transport",
    type: "Highway",
    state: "Maharashtra",
    district: "Nashik",
    status: "At Risk",
    progress: 44,
    cases: 5,
    targetDate: "15 Oct 2026",
  },
];
const cases = [
  {
    id: "c1",
    caseId: "NLA-PB-RLY-2026-000123",
    projectId: "p1",
    status: "IN_PROGRESS",
    currentStage: "Document Verification",
  },
  {
    id: "c2",
    caseId: "NLA-MH-NHA-2026-000084",
    projectId: "p2",
    status: "DELAYED",
    currentStage: "Compensation",
  },
];

export const demoRepository = {
  listProjects: () => projects,
  getProject: (id: string) => projects.find((project) => project.id === id),
  listCases: () => cases,
  getCase: (id: string) => cases.find((item) => item.id === id),
  dashboard: () => ({
    totalProjects: projects.length,
    totalCases: 20,
    inProgress: 11,
    completed: 3,
    delayed: 3,
    atRisk: 3,
    pendingApprovals: 7,
    compensationPending: 6,
    rrPending: 4,
    possessionPending: 2,
  }),
};
