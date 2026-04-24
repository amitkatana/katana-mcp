import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import "./shared/styles/tokens.css";
import "./shared/styles/base.css";
import "./features/products/product.css";

const container = document.getElementById("root")!;
createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
