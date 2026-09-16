import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { randomUUID } from "node:crypto";

export type DemoRole =
  | "SUPER_ADMIN"
  | "NATIONAL_ADMIN"
  | "DEPARTMENT_ADMIN"
  | "PROJECT_OFFICER"
  | "DISTRICT_OFFICER"
  | "FIELD_OFFICER"
  | "REVIEWER"
  | "VIEWER";

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: DemoRole;
  department?: string;
  district?: string;
  password: string;
}

export interface Project {
  id: string;
  projectId: string;
  name: string;
  department: string;
  authority: string;
  type: string;
  state: string;
  district: string;
  tehsil: string;
  village: string;
  status: string;
  progress: number;
  targetDate: string;
  description: string;
  alignment: [number, number][];
  workflowTemplateId: string;
  createdAt: string;
}

export interface Parcel {
  id: string;
  externalId: string;
  projectId: string;
  state: string;
  district: string;
  tehsil: string;
  village: string;
  surveyNumber: string;
  ownerReference: string;
  totalArea: number;
  requiredArea: number;
  geometry: [number, number][];
  sourceSystem: string;
  sourceReference: string;
  acquisitionStatus: string;
  caseId?: string;
}

export interface Case {
  id: string;
  caseId: string;
  projectId: string;
  parcelId: string;
  status: string;
  risk: string;
  currentStage: string;
  progress: number;
  assignedOfficerId?: string;
  dueDate?: string;
  externalRefs: { system: string; id: string }[];
  createdAt: string;
}

export interface WorkflowStage {
  id: string;
  templateId: string;
  name: string;
  sequence: number;
  legalSection?: string;
  responsibleRole: DemoRole;
  requiredDocuments: string[];
  slaDays: number;
  approvalRequired: boolean;
}

export interface Task {
  id: string;
  caseId: string;
  stageId: string;
  status:
    | "PENDING"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "REJECTED"
    | "ESCALATED"
    | "OVERDUE";
  assignedUserId?: string;
  dueAt: string;
  remarks?: string;
}

export interface Notification {
  id: string;
  recipientId?: string;
  type: string;
  title: string;
  message: string;
  severity: string;
  projectId?: string;
  caseId?: string;
  taskId?: string;
  readAt?: string;
  createdAt: string;
}

export interface Audit {
  id: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface Compensation {
  id: string;
  caseId: string;
  assessedAmount: number;
  approvedAmount: number;
  paidAmount: number;
  status: string;
  paymentReference?: string;
  paymentDate?: string;
  sourceSystem: string;
  externalReference?: string;
  lastSyncedAt?: string;
}

export interface RR {
  id: string;
  caseId: string;
  affectedFamilies: number;
  displacedFamilies: number;
  eligibleFamilies: number;
  benefitsDelivered: number;
  status: string;
}

export interface Possession {
  id: string;
  caseId: string;
  status: string;
  noticeDate?: string;
  possessionDate?: string;
  officerId?: string;
  remarks?: string;
}

export interface SyncLog {
  id: string;
  system: string;
  status: string;
  records: number;
  message: string;
  syncedAt: string;
}

export interface State {
  users: User[];
  projects: Project[];
  parcels: Parcel[];
  cases: Case[];
  stages: WorkflowStage[];
  tasks: Task[];
  notifications: Notification[];
  audits: Audit[];
  compensations: Compensation[];
  rr: RR[];
  possessions: Possession[];
  syncLogs: SyncLog[];
}

const path = resolve(process.env.NLAMS_DATA_FILE || ".data/nlams.json");
const now = () => new Date().toISOString();
export const uid = () => randomUUID();
const users: User[] = [
  ["superadmin@nlams.demo", "Super Admin", "SUPER_ADMIN"],
  ["national@nlams.demo", "National Admin", "NATIONAL_ADMIN"],
  ["department@nlams.demo", "Department Admin", "DEPARTMENT_ADMIN"],
  ["project@nlams.demo", "Project Officer", "PROJECT_OFFICER"],
  ["district@nlams.demo", "District Officer", "DISTRICT_OFFICER"],
  ["field@nlams.demo", "Field Officer", "FIELD_OFFICER"],
  ["reviewer@nlams.demo", "Reviewer", "REVIEWER"],
  ["viewer@nlams.demo", "Viewer", "VIEWER"],
].map(([email, displayName, role]) => ({
  id: email,
  email,
  displayName,
  role: role as DemoRole,
  password: (
    {
      SUPER_ADMIN: "Admin@123",
      NATIONAL_ADMIN: "National@123",
      DEPARTMENT_ADMIN: "Department@123",
      PROJECT_OFFICER: "Project@123",
      DISTRICT_OFFICER: "District@123",
      FIELD_OFFICER: "Field@123",
      REVIEWER: "Reviewer@123",
      VIEWER: "Viewer@123",
    } as Record<string, string>
  )[role],
}));

function seed(): State {
  const templateId = "nh-act-1956";
  const projectId = "prj-nh44-demo";
  const stages: WorkflowStage[] = [
    ["3A Preliminary notification", "3A", "PROJECT_OFFICER", 7],
    ["3C Objection hearing", "3C", "DISTRICT_OFFICER", 14],
    ["3D Declaration of acquisition", "3D", "NATIONAL_ADMIN", 7],
    ["3G Compensation determination", "3G", "DEPARTMENT_ADMIN", 21],
    ["3H Deposit and payment", "3H", "PROJECT_OFFICER", 14],
    ["3E Taking possession", "3E", "DISTRICT_OFFICER", 14],
    ["R&R completion", undefined, "FIELD_OFFICER", 30],
  ].map(([name, legalSection, role, sla], i) => ({
    id: `${templateId}-${i + 1}`,
    templateId,
    name: String(name),
    legalSection: legalSection ? String(legalSection) : undefined,
    responsibleRole: role as DemoRole,
    sequence: i + 1,
    requiredDocuments: i === 0 ? ["Section 3A notification"] : [],
    slaDays: Number(sla),
    approvalRequired: ["3D", "3G", "3E"].includes(String(legalSection)),
  }));
  const project: Project = {
    id: projectId,
    projectId: "NH-DEMO-PB-001",
    name: "NH-44 Corridor Expansion — Demo Section",
    department: "Road Transport / National Highway Authority Demo",
    authority: "Mohali District Authority (Demo)",
    type: "National Highway",
    state: "Punjab",
    district: "Mohali",
    tehsil: "Kharar",
    village: "Demo Nagar",
    status: "In Progress",
    progress: 42,
    targetDate: "2027-03-31",
    description:
      "Fictional roadway project using simulated parcel data for demonstration only.",
    alignment: [
      [30.75, 76.62],
      [30.77, 76.68],
      [30.8, 76.74],
      [30.83, 76.8],
    ] as [number, number][],
    workflowTemplateId: templateId,
    createdAt: now(),
  };
  const parcels: Parcel[] = Array.from({ length: 10 }, (_, i) => {
    const lat = 30.755 + i * 0.008;
    const lng = 76.625 + i * 0.018;
    return {
      id: `parcel-${i + 1}`,
      externalId: `DEMO-PB-MOH-${String(i + 1).padStart(4, "0")}`,
      projectId,
      state: "Punjab",
      district: "Mohali",
      tehsil: "Kharar",
      village: i % 2 ? "Demo Nagar" : "Sample Kalan",
      surveyNumber: `${118 + i}/${i + 1}`,
      ownerReference: `DEMO-OWNER-${i + 1}`,
      totalArea: 2.4 + i * 0.31,
      requiredArea: 1.1 + i * 0.15,
      geometry: [
        [lat, lng],
        [lat + 0.006, lng + 0.008],
        [lat + 0.003, lng + 0.016],
        [lat - 0.003, lng + 0.008],
      ] as [number, number][],
      sourceSystem: "Mock State Land Records",
      sourceReference: `SLR-DEMO-${i + 1}`,
      acquisitionStatus: [
        "3A",
        "3C",
        "3D",
        "3G",
        "3H",
        "3E",
        "POSSESSION_COMPLETED",
      ][i % 7],
    };
  });
  const officerEmails = [
    "project@nlams.demo",
    "district@nlams.demo",
    "department@nlams.demo",
    "project@nlams.demo",
    "project@nlams.demo",
    "district@nlams.demo",
    "field@nlams.demo",
  ];
  const cases: Case[] = parcels.map((parcel, i) => ({
    id: `case-${i + 1}`,
    caseId: `NLA-PB-NH44-2026-${String(i + 1).padStart(4, "0")}`,
    projectId,
    parcelId: parcel.id,
    status: i === 5 ? "Completed" : i === 1 ? "Under Review" : "In Progress",
    risk: i === 2 ? "High" : i === 6 ? "Medium" : "Low",
    currentStage: stages[Math.min(i % stages.length, stages.length - 1)].name,
    progress: Math.round(((i % stages.length) / stages.length) * 100),
    assignedOfficerId: users.find(
      (u) => u.email === officerEmails[i % officerEmails.length],
    )!.id,
    dueDate: new Date(Date.now() + (i - 3) * 86400000).toISOString(),
    externalRefs: [{ system: "Mock Land Records", id: parcel.sourceReference }],
    createdAt: now(),
  }));
  const tasks: Task[] = cases.map((c, i) => ({
    id: `task-${i + 1}`,
    caseId: c.id,
    stageId: stages[i % stages.length].id,
    status: i < 2 ? "IN_PROGRESS" : i === 2 ? "OVERDUE" : "PENDING",
    assignedUserId: c.assignedOfficerId,
    dueAt: c.dueDate || now(),
  }));
  const compensations = cases.map((c, i) => ({
    id: `comp-${i + 1}`,
    caseId: c.id,
    assessedAmount: 1000000 + i * 125000,
    approvedAmount: i > 2 ? 950000 + i * 100000 : 0,
    paidAmount: i > 5 ? 950000 + i * 100000 : 0,
    status: i > 5 ? "PAID" : i > 2 ? "APPROVED" : "ASSESSED",
    sourceSystem: "Mock PFMS",
  }));
  const rr = cases.map((c, i) => ({
    id: `rr-${i + 1}`,
    caseId: c.id,
    affectedFamilies: 5 + i,
    displacedFamilies: i % 3,
    eligibleFamilies: 4 + i,
    benefitsDelivered: i > 5 ? 4 + i : i,
    status: i > 5 ? "COMPLETED" : "IN_PROGRESS",
  }));
  const possessions = cases.map((c, i) => ({
    id: `pos-${i + 1}`,
    caseId: c.id,
    status: i > 6 ? "POSSESSION_COMPLETED" : i > 4 ? "READY" : "NOT_READY",
  }));
  return {
    users,
    projects: [project],
    parcels,
    cases,
    stages,
    tasks,
    notifications: [
      {
        id: uid(),
        recipientId: "district@nlams.demo",
        type: "TASK_ASSIGNED",
        title: "Objection hearing task assigned",
        message:
          "Review the Section 3C objection task for NH-44 Corridor Expansion.",
        severity: "INFO",
        projectId,
        caseId: cases[1].id,
        taskId: tasks[1].id,
        createdAt: now(),
      },
    ],
    audits: [
      {
        id: uid(),
        actorId: "seed",
        action: "DEMO_SEEDED",
        entityType: "PROJECT",
        entityId: projectId,
        metadata: { source: "seed" },
        createdAt: now(),
      },
    ],
    compensations,
    rr,
    possessions,
    syncLogs: [
      {
        id: uid(),
        system: "land-records",
        status: "MOCK",
        records: 10,
        message: "Simulated parcel synchronization",
        syncedAt: now(),
      },
    ],
  };
}

export function loadState(): State {
  if (!existsSync(path)) {
    mkdirSync(dirname(path), { recursive: true });
    const value = seed();
    writeFileSync(path, JSON.stringify(value, null, 2));
    return value;
  }
  const value = JSON.parse(readFileSync(path, "utf8")) as State;
  value.users = value.users.map((user) => ({
    ...user,
    password:
      users.find((item) => item.email === user.email)?.password ||
      user.password,
  }));
  return value;
}
export function saveState(value: State) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(value, null, 2));
}
export function audit(
  state: State,
  actorId: string,
  action: string,
  entityType: string,
  entityId: string | undefined,
  metadata: Record<string, unknown> = {},
) {
  state.audits.unshift({
    id: uid(),
    actorId,
    action,
    entityType,
    entityId,
    metadata,
    createdAt: now(),
  });
}
export function notify(
  state: State,
  input: Omit<Notification, "id" | "createdAt">,
) {
  state.notifications.unshift({ ...input, id: uid(), createdAt: now() });
}
export const dbPath = path;
