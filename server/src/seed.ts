import { loadState, saveState, dbPath } from "./repositories/local.repository.js";
const state = loadState();
saveState(state);
console.log(
  JSON.stringify({
    level: "info",
    message: `Idempotent local demo seed persisted to ${dbPath}. Use Supabase service-role seeding for cloud Auth deployments.`,
    records: {
      projects: state.projects.length,
      cases: state.cases.length,
      parcels: state.parcels.length,
      tasks: state.tasks.length,
      notifications: state.notifications.length,
      auditLogs: state.audits.length,
    },
  }),
);
