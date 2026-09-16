import { Routes, Route } from "react-router-dom";
import { PortalLayout } from "./layouts/PortalLayout";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProjectsPage, ProjectDetailsPage } from "./pages/ProjectsPage";
import { CasesPage, CaseDetailsPage } from "./pages/CasesPage";
import { GISPage } from "./pages/GISPage";
import { DocumentsPage } from "./pages/DocumentsPage";
import { ReportsPage } from "./pages/ReportsPage";
import { AuditPage } from "./pages/AuditPage";
import { IntegrationsPage } from "./pages/IntegrationsPage";
import { ModulePage } from "./pages/ModulePage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<PortalLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:id" element={<ProjectDetailsPage />} />
        <Route path="cases" element={<CasesPage />} />
        <Route path="cases/:id" element={<CaseDetailsPage />} />
        <Route path="map" element={<GISPage />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route
          path="compensation"
          element={
            <ModulePage
              title="Compensation monitoring"
              description="Track award, payment, and PFMS synchronization across cases."
            />
          }
        />
        <Route
          path="rr"
          element={
            <ModulePage
              title="Rehabilitation & Resettlement"
              description="Monitor entitlements, affected family references, and completion targets."
            />
          }
        />
        <Route path="reports" element={<ReportsPage />} />
        <Route
          path="users"
          element={
            <ModulePage
              title="Users & authority registry"
              description="Configure department, geography, workflow stage, role, and user assignments."
            />
          }
        />
        <Route path="audit" element={<AuditPage />} />
        <Route path="integrations" element={<IntegrationsPage />} />
      </Route>
    </Routes>
  );
}
