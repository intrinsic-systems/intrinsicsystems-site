import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

import { CoreFlowShell } from "./core/CoreFlowShell";
import { CoreStartRoute } from "./core/routes/CoreStartRoute";
import { CoreOnboardingRoute } from "./core/routes/CoreOnboardingRoute";
import { CoreAcmaRoute } from "./core/routes/CoreAcmaRoute";
import { CoreResultsRoute } from "./core/results/CoreResultsRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/core/start" replace />} />
        <Route path="/core" element={<Navigate to="/core/start" replace />} />

        <Route path="/core/*" element={<CoreFlowShell />}>
          <Route path="start" element={<CoreStartRoute />} />
          <Route path="onboarding" element={<CoreOnboardingRoute />} />
          <Route path="acma" element={<CoreAcmaRoute />} />
          <Route path="results" element={<CoreResultsRoute />} />
        </Route>

        <Route path="*" element={<Navigate to="/core/start" replace />} />
      </Routes>
    </BrowserRouter>
  );
}