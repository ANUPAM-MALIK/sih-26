import "../client/src/styles.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "../client/src/App";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
