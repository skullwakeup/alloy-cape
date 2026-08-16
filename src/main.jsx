import React from "react";
import ReactDOM from "react-dom/client";

import {
  AuthProvider,
} from "./context/AuthContext";

import {
  InvestigationProvider,
} from "./context/InvestigationContext";

import {
  IssueProvider,
} from "./context/IssueContext";

import App from "./App";

import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>

    <AuthProvider>

      <InvestigationProvider>

        <IssueProvider>

          <App />

        </IssueProvider>

      </InvestigationProvider>

    </AuthProvider>

  </React.StrictMode>

);