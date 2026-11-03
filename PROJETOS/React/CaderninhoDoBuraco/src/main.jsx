import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// Fontes embutidas no projeto (Fontsource): não dependem do Google Fonts
//   Cinzel Decorative: o letreiro (nome do site), com capitulares de cassino
//   Cinzel: títulos, índices das cartas e placares
//   Figtree: textos e botões
//   Caveat: o que é "escrito à mão" no caderninho
import "@fontsource/cinzel-decorative/700.css";
import "@fontsource/cinzel-decorative/900.css";
import "@fontsource-variable/cinzel";
import "@fontsource-variable/figtree";
import "@fontsource-variable/caveat";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
