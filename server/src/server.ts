import { app } from "./app.js";
import { env } from "./config/env.js";

app.listen(env.port, () =>
  console.info(
    JSON.stringify({
      level: "info",
      message: `N-LAMS API listening on ${env.port}`,
      demoMode: true,
    }),
  ),
);
