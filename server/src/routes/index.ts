import { Router } from "express";
import { z } from "zod";
import { requireRoles } from "../middleware/auth.js";
import { createStorage } from "../storage/index.js";
import {
  MockAcquisitionAdapter,
  MockLandRecordsAdapter,
  MockPfmsAdapter,
} from "../integrations/interfaces.js";
import { audit, loadState, notify, saveState, uid, type DemoRole } from "../repositories/local.repository.js";

export const api = Router();
const roles = (...items: DemoRole[]) => requireRoles(...items);
const projectSchema = z.object({
  projectId: z.string().optional(),
  name: z.string().min(3),
  department: z.string().min(2),
  state: z.string().min(2),
  district: z.string().min(2),
  type: z.string().min(2),
  authority: z.string().optional(), tehsil: z.string().optional(), village: z.string().optional(), targetDate: z.string().optional(), description: z.string().optional(), alignment: z.array(z.array(z.number())).optional(),
});

api.get("/health", (_req, res) =>
  res.json({ data: { service: "n-lams-api", status: "ok", demoMode: true, persistence: "local-json" } }),
);
api.post("/auth/login", (req, res) => { const input = z.object({ email: z.string().email(), password: z.string().min(1) }).parse(req.body); const user = loadState().users.find((item) => item.email === input.email && item.password === input.password); if (!user) return res.status(401).json({ error: { code: "INVALID_CREDENTIALS", message: "Invalid demo credentials." } }); return res.json({ data: { token: user.id, user: { id: user.id, email: user.email, displayName: user.displayName, role: user.role } } }); });
api.get("/me", (req, res) => { const state = loadState(); const user = state.users.find((item) => item.id === req.auth?.userId); res.json({ data: user ? { id: user.id, email: user.email, displayName: user.displayName, role: user.role } : null }); });
api.get("/dashboard/summary", (_req, res) => { const state = loadState(); const active = state.projects.filter((p) => p.status !== "Completed").length; res.json({ data: { totalProjects: state.projects.length, activeProjects: active, totalCases: state.cases.length, totalParcels: state.parcels.length, inProgress: state.cases.filter((c) => c.status === "In Progress").length, completed: state.cases.filter((c) => c.status === "Completed").length, delayed: state.tasks.filter((t) => t.status === "OVERDUE").length, atRisk: state.cases.filter((c) => ["High", "Critical"].includes(c.risk)).length, pendingApprovals: state.tasks.filter((t) => t.status === "PENDING").length, compensationPending: state.compensations.filter((c) => c.status !== "PAID").length, rrPending: state.rr.filter((r) => r.status !== "COMPLETED").length, possessionCompleted: state.possessions.filter((p) => p.status === "POSSESSION_COMPLETED").length, affectedFamilies: state.rr.reduce((sum, item) => sum + item.affectedFamilies, 0), compensationAssessed: state.compensations.reduce((sum, item) => sum + item.assessedAmount, 0), compensationPaid: state.compensations.reduce((sum, item) => sum + item.paidAmount, 0) } }); });
api.get("/projects", (_req, res) => { const state = loadState(); res.json({ data: state.projects.map((p) => ({ ...p, cases: state.cases.filter((c) => c.projectId === p.id).length })), meta: { demo: true, persistent: true } }); });
api.get("/projects/:id", (req, res) => {
  const state = loadState(); const project = state.projects.find((item) => item.id === req.params.id || item.projectId === req.params.id);
  return project
    ? res.json({ data: { ...project, parcels: state.parcels.filter((p) => p.projectId === project.id), cases: state.cases.filter((c) => c.projectId === project.id) } })
    : res
        .status(404)
        .json({ error: { code: "NOT_FOUND", message: "Project not found." } });
});
api.post(
  "/projects",
  roles("SUPER_ADMIN", "NATIONAL_ADMIN", "DEPARTMENT_ADMIN", "PROJECT_OFFICER"),
  (req, res) => {
    const input = projectSchema.parse(req.body);
    const state = loadState(); const project = { id: `project-${Date.now()}`, projectId: input.projectId || `NLA-${Date.now()}`, ...input, authority: input.authority || "Demo Authority", tehsil: input.tehsil || "Demo Tehsil", village: input.village || "Demo Village", status: "Draft", progress: 0, targetDate: input.targetDate || "2027-12-31", description: input.description || "Demo project", alignment: (input.alignment || []) as [number, number][], workflowTemplateId: "nh-act-1956", createdAt: new Date().toISOString() }; state.projects.push(project); audit(state, req.auth!.userId, "PROJECT_CREATED", "PROJECT", project.id, { name: project.name }); notify(state, { recipientId: req.auth!.userId, type: "SYSTEM_ALERT", title: "Project created", message: `${project.name} is ready for parcel association.`, severity: "INFO", projectId: project.id }); saveState(state); res.status(201).json({ data: project });
  },
);
api.get("/cases", (_req, res) => { const state = loadState(); res.json({ data: state.cases.map((c) => ({ ...c, projectName: state.projects.find((p) => p.id === c.projectId)?.name || "", parcelId: state.parcels.find((p) => p.id === c.parcelId)?.externalId || "", surveyNumber: state.parcels.find((p) => p.id === c.parcelId)?.surveyNumber || "", village: state.parcels.find((p) => p.id === c.parcelId)?.village || "", state: "Punjab", district: "Mohali", stage: c.currentStage, officer: state.users.find((u) => u.id === c.assignedOfficerId)?.displayName || "Unassigned" })), meta: { total: state.cases.length, persistent: true } }); });
api.get("/cases/:id", (req, res) => {
  const state = loadState(); const item = state.cases.find((c) => c.id === req.params.id || c.caseId === req.params.id);
  return item
    ? res.json({ data: { ...item, project: state.projects.find((p) => p.id === item.projectId), parcel: state.parcels.find((p) => p.id === item.parcelId), tasks: state.tasks.filter((t) => t.caseId === item.id), compensation: state.compensations.find((c) => c.caseId === item.id), possession: state.possessions.find((p) => p.caseId === item.id), rr: state.rr.find((r) => r.caseId === item.id) } })
    : res
        .status(404)
        .json({ error: { code: "NOT_FOUND", message: "Case not found." } });
});
api.post("/parcels", roles("SUPER_ADMIN", "NATIONAL_ADMIN", "PROJECT_OFFICER", "FIELD_OFFICER"), (req, res) => { const input = z.object({ projectId: z.string(), externalId: z.string(), surveyNumber: z.string(), village: z.string(), totalArea: z.number(), requiredArea: z.number(), geometry: z.array(z.array(z.number())).min(3) }).parse(req.body); const state = loadState(); const parcel = { id: uid(), ...input, geometry: input.geometry as [number, number][], state: "Punjab", district: "Mohali", tehsil: "Kharar", ownerReference: `DEMO-OWNER-${Date.now()}`, sourceSystem: "N-LAMS demo / simulated", sourceReference: input.externalId, acquisitionStatus: "PROPOSED" }; state.parcels.push(parcel); audit(state, req.auth!.userId, "PARCEL_CREATED", "PARCEL", parcel.id, { source: "simulated" }); saveState(state); res.status(201).json({ data: parcel }); });
api.post("/cases", roles("SUPER_ADMIN", "NATIONAL_ADMIN", "PROJECT_OFFICER", "DISTRICT_OFFICER"), (req, res) => { const input = z.object({ projectId: z.string(), parcelId: z.string(), assignedOfficerId: z.string().optional() }).parse(req.body); const state = loadState(); const parcel = state.parcels.find((p) => p.id === input.parcelId); if (!parcel) return res.status(404).json({ error: { code: "PARCEL_NOT_FOUND", message: "Parcel not found." } }); const item = { id: uid(), caseId: `NLA-PB-${Date.now()}`, ...input, status: "Draft", risk: "Low", currentStage: "Not started", progress: 0, externalRefs: [{ system: "Mock Land Records", id: parcel.sourceReference }], createdAt: new Date().toISOString() }; state.cases.push(item); parcel.caseId = item.id; parcel.acquisitionStatus = "CASE_CREATED"; audit(state, req.auth!.userId, "CASE_CREATED", "CASE", item.id, {}); saveState(state); res.status(201).json({ data: item }); });
api.get("/cases/:id/timeline", (req, res) => { const state = loadState(); res.json({ data: state.audits.filter((a) => a.entityId === req.params.id) }); });
api.get("/cases/:id/workflow", (req, res) => { const state = loadState(); const item = state.cases.find((c) => c.id === req.params.id); res.json({ data: item ? state.tasks.filter((t) => t.caseId === item.id).map((task) => ({ ...task, stage: state.stages.find((s) => s.id === task.stageId) })) : [] }); });
api.get("/gis/projects/:id/parcels", (req, res) => { const state = loadState(); const parcels = state.parcels.filter((p) => p.projectId === req.params.id); res.json({ data: { type: "FeatureCollection", features: parcels.map((p) => ({ type: "Feature", id: p.id, geometry: { type: "Polygon", coordinates: [[...p.geometry.map(([lat, lng]) => [lng, lat]), [p.geometry[0][1], p.geometry[0][0]]]] }, properties: { ...p, demo: true, label: "Demo / Simulated Parcel Data" } })) } }); });
api.get("/notifications", (req, res) => { const state = loadState(); res.json({ data: state.notifications.filter((n) => !n.recipientId || n.recipientId === req.auth?.userId) }); });
api.patch("/notifications/:id/read", (req, res) => { const state = loadState(); const item = state.notifications.find((n) => n.id === req.params.id); if (!item) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Notification not found." } }); item.readAt = new Date().toISOString(); saveState(state); res.json({ data: item }); });
api.get("/audit", roles("SUPER_ADMIN", "NATIONAL_ADMIN", "DEPARTMENT_ADMIN", "REVIEWER"), (_req, res) => res.json({ data: loadState().audits }));
api.get("/reports/summary", (_req, res) => { const state = loadState(); res.json({ data: state.projects.map((p) => ({ project: p.name, projectId: p.projectId, cases: state.cases.filter((c) => c.projectId === p.id).length, parcels: state.parcels.filter((x) => x.projectId === p.id).length, progress: p.progress, compensationAssessed: state.compensations.filter((c) => state.cases.find((x) => x.id === c.caseId)?.projectId === p.id).reduce((s, c) => s + c.assessedAmount, 0), compensationPaid: state.compensations.filter((c) => state.cases.find((x) => x.id === c.caseId)?.projectId === p.id).reduce((s, c) => s + c.paidAmount, 0) })) }); });
api.get("/compensation", (_req, res) => res.json({ data: loadState().compensations }));
api.patch("/compensation/:id", roles("SUPER_ADMIN", "NATIONAL_ADMIN", "DEPARTMENT_ADMIN", "PROJECT_OFFICER"), (req, res) => { const state = loadState(); const item = state.compensations.find((c) => c.id === req.params.id); if (!item) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Compensation record not found." } }); const input = z.object({ assessedAmount: z.number().optional(), approvedAmount: z.number().optional(), paidAmount: z.number().optional(), status: z.string().optional(), paymentReference: z.string().optional() }).parse(req.body); Object.assign(item, input); audit(state, req.auth!.userId, "COMPENSATION_UPDATED", "COMPENSATION", item.id, input); saveState(state); res.json({ data: item }); });
api.post("/compensation/:id/sync", roles("SUPER_ADMIN", "NATIONAL_ADMIN", "DEPARTMENT_ADMIN", "PROJECT_OFFICER"), async (req, res) => { const state = loadState(); const item = state.compensations.find((c) => c.id === req.params.id); if (!item) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Compensation record not found." } }); const result = await new MockPfmsAdapter().getPaymentStatus(item.caseId); item.paidAmount = result.paidAmount; item.paymentReference = result.reference; item.status = result.status === "PAID" ? "PAID" : "PARTIALLY_PAID"; item.externalReference = result.reference; item.lastSyncedAt = new Date().toISOString(); audit(state, req.auth!.userId, "PAYMENT_SYNCED", "COMPENSATION", item.id, { sourceSystem: "Mock PFMS", status: result.status }); state.syncLogs.unshift({ id: uid(), system: "pfms", status: "MOCK", records: 1, message: "Simulated PFMS synchronization", syncedAt: new Date().toISOString() }); saveState(state); res.json({ data: item }); });
api.get("/possession", (_req, res) => res.json({ data: loadState().possessions }));
api.patch("/possession/:id", roles("SUPER_ADMIN", "NATIONAL_ADMIN", "DISTRICT_OFFICER", "FIELD_OFFICER"), (req, res) => { const state = loadState(); const item = state.possessions.find((p) => p.id === req.params.id); if (!item) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Possession record not found." } }); const input = z.object({ status: z.string(), remarks: z.string().optional() }).parse(req.body); Object.assign(item, input, { officerId: req.auth!.userId, possessionDate: input.status === "POSSESSION_COMPLETED" ? new Date().toISOString() : item.possessionDate }); audit(state, req.auth!.userId, "POSSESSION_UPDATED", "POSSESSION", item.id, input); saveState(state); res.json({ data: item }); });
api.get("/rr", (_req, res) => res.json({ data: loadState().rr }));
api.patch("/rr/:id", roles("SUPER_ADMIN", "NATIONAL_ADMIN", "DEPARTMENT_ADMIN", "DISTRICT_OFFICER", "FIELD_OFFICER"), (req, res) => { const state = loadState(); const item = state.rr.find((r) => r.id === req.params.id); if (!item) return res.status(404).json({ error: { code: "NOT_FOUND", message: "R&R record not found." } }); const input = z.object({ benefitsDelivered: z.number().optional(), status: z.string().optional() }).parse(req.body); Object.assign(item, input); audit(state, req.auth!.userId, "R_AND_R_UPDATED", "RR", item.id, input); saveState(state); res.json({ data: item }); });
api.post(
  "/cases/:id/workflow/start",
  roles(
    "SUPER_ADMIN",
    "NATIONAL_ADMIN",
    "DEPARTMENT_ADMIN",
    "PROJECT_OFFICER",
  ),
  (req, res) => { const state = loadState(); const item = state.cases.find((c) => c.id === req.params.id); if (!item) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Case not found." } }); const stage = state.stages.find((s) => s.templateId === "nh-act-1956" && s.sequence === 1)!; const task = state.tasks.find((t) => t.caseId === item.id) || { id: uid(), caseId: item.id, stageId: stage.id, status: "PENDING" as const, dueAt: new Date(Date.now() + stage.slaDays * 86400000).toISOString() }; task.status = "IN_PROGRESS"; task.assignedUserId = task.assignedUserId || state.users.find((u) => u.role === stage.responsibleRole)?.id; if (!state.tasks.some((t) => t.id === task.id)) state.tasks.push(task); item.currentStage = stage.name; item.status = "In Progress"; item.progress = 10; audit(state, req.auth!.userId, "WORKFLOW_STARTED", "CASE", item.id, { legalSection: stage.legalSection }); notify(state, { recipientId: task.assignedUserId, type: "TASK_ASSIGNED", title: "Workflow task assigned", message: stage.name, severity: "INFO", caseId: item.id, taskId: task.id, projectId: item.projectId }); saveState(state); res.status(201).json({ data: task }); },
);
api.post(
  "/tasks/:id/complete",
  roles(
    "SUPER_ADMIN",
    "NATIONAL_ADMIN",
    "DEPARTMENT_ADMIN",
    "PROJECT_OFFICER",
    "DISTRICT_OFFICER",
    "REVIEWER",
  ),
  (req, res) => { const state = loadState(); const task = state.tasks.find((t) => t.id === req.params.id); if (!task) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Task not found." } }); const item = state.cases.find((c) => c.id === task.caseId)!; const current = state.stages.find((s) => s.id === task.stageId)!; task.status = "COMPLETED"; task.remarks = req.body.remarks || ""; const next = state.stages.find((s) => s.templateId === current.templateId && s.sequence === current.sequence + 1); if (next) { const nextTask = { id: uid(), caseId: item.id, stageId: next.id, status: "PENDING" as const, assignedUserId: state.users.find((u) => u.role === next.responsibleRole)?.id, dueAt: new Date(Date.now() + next.slaDays * 86400000).toISOString() }; state.tasks.push(nextTask); item.currentStage = next.name; item.progress = Math.round((next.sequence - 1) / state.stages.length * 100); notify(state, { recipientId: nextTask.assignedUserId, type: "WORKFLOW_ADVANCED", title: "Workflow advanced", message: `${item.caseId} advanced to ${next.name}`, severity: "INFO", caseId: item.id, taskId: nextTask.id, projectId: item.projectId }); } else { item.status = "Completed"; item.progress = 100; } audit(state, req.auth!.userId, "TASK_COMPLETED", "TASK", task.id, { legalSection: current.legalSection }); saveState(state); res.json({ data: task, nextStage: next?.name }); },
);
api.post(
  "/tasks/:id/reject",
  roles("SUPER_ADMIN", "NATIONAL_ADMIN", "DEPARTMENT_ADMIN", "REVIEWER", "DISTRICT_OFFICER"),
  (req, res) => { const state = loadState(); const task = state.tasks.find((t) => t.id === req.params.id); if (!task) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Task not found." } }); task.status = "REJECTED"; task.remarks = req.body.remarks || ""; audit(state, req.auth!.userId, "TASK_REJECTED", "TASK", task.id, {}); saveState(state); res.json({ data: task }); },
);
api.post(
  "/documents/presigned-upload",
  requireRoles(
    "SUPER_ADMIN",
    "NATIONAL_ADMIN",
    "DEPARTMENT_ADMIN",
    "PROJECT_OFFICER",
    "FIELD_OFFICER",
  ),
  async (req, res) => {
    const input = z
      .object({
        projectId: z.string(),
        caseId: z.string(),
        documentId: z.string().uuid().or(z.string().min(2)),
        fileName: z.string().min(1),
        contentType: z.string().min(1),
        version: z.number().int().positive(),
      })
      .parse(req.body);
    const storage = await createStorage();
    const result = await storage.createUploadUrl({
      objectKey: `n-lams/projects/${input.projectId}/cases/${input.caseId}/documents/${input.documentId}/v${input.version}/${input.fileName}`,
      contentType: input.contentType,
    });
    res.json({ data: result });
  },
);
api.get("/integrations/:system/status", (req, res) =>
  res.json({
    data: {
      system: req.params.system,
      status: ["pfms", "railway"].includes(req.params.system)
        ? "DEMO / MOCK"
        : "CONNECTED",
      lastSyncedAt: new Date().toISOString(),
    },
  }),
);
api.get("/integrations", (_req, res) => { const state = loadState(); res.json({ data: ["land-records", "acquisition", "pfms", "gis"].map((system) => ({ system, adapter: system === "pfms" ? "MockPfmsAdapter" : system === "land-records" ? "MockLandRecordsAdapter" : "MockAdapter", status: "MOCK", lastSyncedAt: state.syncLogs.find((s) => s.system === system)?.syncedAt || null, records: state.syncLogs.find((s) => s.system === system)?.records || 0, label: "DEMO / MOCK" })) }); });
api.post("/integrations/:system/sync", roles("SUPER_ADMIN", "NATIONAL_ADMIN", "DEPARTMENT_ADMIN"), async (req, res) => { const state = loadState(); const system = String(req.params.system); const result = system === "pfms" ? await new MockPfmsAdapter().getPaymentStatus("DEMO-SYNC") : system === "land-records" ? await new MockLandRecordsAdapter().getParcel("DEMO-SYNC") : { status: "OK" }; const recordCount = system === "land-records" ? state.parcels.length : system === "pfms" ? state.compensations.length : 1; const log = { id: uid(), system, status: "MOCK", records: recordCount, message: "Simulated adapter synchronization completed", syncedAt: new Date().toISOString() }; state.syncLogs.unshift(log); audit(state, req.auth!.userId, "INTEGRATION_SYNC", "INTEGRATION", undefined, { system, result }); saveState(state); res.json({ data: log }); });
api.get("/integrations/demo/parcel/:id", async (req, res) =>
  res.json({
    data: await new MockLandRecordsAdapter().getParcel(req.params.id),
  }),
);
api.get("/integrations/demo/case/:id", async (req, res) =>
  res.json({ data: await new MockAcquisitionAdapter().getCase(req.params.id) }),
);
api.get("/integrations/demo/payment/:id", async (req, res) =>
  res.json({
    data: await new MockPfmsAdapter().getPaymentStatus(req.params.id),
  }),
);
