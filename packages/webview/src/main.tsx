import * as React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./App.js";
import "formiojs/dist/formio.full.css";
import "./index.css";
import { VSCodeProvider } from "./vscodeAPI/context.js";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const vscode = window.acquireVsCodeApi ? window.acquireVsCodeApi() : null;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <VSCodeProvider.Provider value={vscode}>
      <App />
    </VSCodeProvider.Provider>
  </React.StrictMode>
);
