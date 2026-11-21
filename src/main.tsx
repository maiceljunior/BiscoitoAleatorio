import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { blockZoomGestures } from "./lib/noZoom";
import "./styles.css";

blockZoomGestures();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
