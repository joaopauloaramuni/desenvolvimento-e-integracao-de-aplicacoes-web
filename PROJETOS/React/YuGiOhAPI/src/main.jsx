import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./i18n"; // inicia o i18next antes de qualquer componente
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
