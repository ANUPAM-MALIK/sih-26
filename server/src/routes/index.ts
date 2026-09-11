import { Router } from "express";
import { z } from "zod";
import { demoRepository } from "../repositories/demo.repository.js";
import { requireRoles } from "../middleware/auth.js";
import { createStorage } from "../storage/index.js";
import {
  MockAcquisitionAdapter,
  MockLandRecordsAdapter,
  MockPfmsAdapter,
} from "../integrations/interfaces.js";

export const api = Router();
const projectSchema = z.object({
  name: z.string().min(3),
  department: z.string().min(2),
  state: z.string().min(2),
  district: z.string().min(2),
  type: z.string().min(2),
});

api.get("/health", (_req, res) =>
  res.json({ data: { service: "n-lams-api", status: "ok", demoMode: true } }),
);
api.get("/dashboard/summary", (_req, res) =>
  res.json({ data: demoRepository.dashboard() }),
);
api.get("/projects", (_req, res) =>
  res.json({ data: demoRepository.listProjects(), meta: { demo: true } }),
);
api.get("/projects/:id", (req, res) => {
  const project = demoRepository.getProject(req.params.id);
  return project
    ? res.json({ data: project })
    : res
        .status(404)
        .json({ error: { code: "NOT_FOUND", message: "Project not found." } });
});
api.post(
  "/projects",
  requireRoles("SUPER_ADMIN", "NATIONAL_ADMIN", "DEPARTMENT_ADMIN"),
  (req, res) => {
    const input = projectSchema.parse(req.body);
    res
      .status(201)
      .json({
        data: {
          id: "demo-new-project",
          ...input,
          status: "Draft",
          progress: 0,
          cases: 0,
        },
        meta: { demo: true },
      });
  },
);
api.get("/cases", (_req, res) =>
  res.json({
    data: demoRepository.listCases(),
    meta: { total: 20, returned: 5, demo: true },
  }),
);
api.get("/cases/:id", (req, res) => {
  const item = demoRepository.getCase(req.params.id);
  return item
    ? res.json({ data: item })
    : res
        .status(404)
        .json({ error: { code: "NOT_FOUND", message: "Case not found." } });
});
api.get("/cases/:id/timeline", (_req, res) => res.json({ data: [] }));
api.get("/cases/:id/workflow", (_req, res) => res.json({ data: [] }));
api.post(
  "/cases/:id/workflow/start",
  requireRoles(
    "SUPER_ADMIN",
    "NATIONAL_ADMIN",
    "DEPARTMENT_ADMIN",
    "PROJECT_OFFICER",
  ),
  (req, res) =>
    res
      .status(201)
      .json({ data: { id: "demo-task", status: "IN_PROGRESS", ...req.body } }),
);
api.post(
  "/tasks/:id/complete",
  requireRoles(
    "SUPER_ADMIN",
    "NATIONAL_ADMIN",
    "DEPARTMENT_ADMIN",
    "PROJECT_OFFICER",
    "DISTRICT_OFFICER",
    "REVIEWER",
  ),
  (req, res) =>
    res.json({
      data: {
        taskId: req.params.id,
        status: "COMPLETED",
        remarks: req.body.remarks || "",
      },
    }),
);
api.post(
  "/tasks/:id/reject",
  requireRoles("SUPER_ADMIN", "NATIONAL_ADMIN", "DEPARTMENT_ADMIN", "REVIEWER"),
  (req, res) =>
    res.json({
      data: {
        taskId: req.params.id,
        status: "REJECTED",
        remarks: req.body.remarks || "",
      },
    }),
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
