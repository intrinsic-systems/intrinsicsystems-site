import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/oasis.css";

import { HomePage } from "./site/pages/HomePage";
import { WhatWeDoPage } from "./site/pages/WhatWeDoPage";
import { PlatformApproachPage } from "./site/pages/PlatformApproachPage";
import { OasisSuitePage } from "./site/pages/OasisSuitePage";
import { MvpStatusPage } from "./site/pages/MvpStatusPage";
import { AboutPage } from "./site/pages/AboutPage";
import { ContactPage } from "./site/pages/ContactPage";
import { OasisModulePage } from "./site/pages/OasisModulePage";

import { CoreFlowShell } from "./core/CoreFlowShell";
import { CoreStartRoute } from "./core/routes/CoreStartRoute";
import { CoreOnboardingRoute } from "./core/routes/CoreOnboardingRoute";
import { CoreAcmaRoute } from "./core/routes/CoreAcmaRoute";
import { CoreResultsRoute } from "./core/results/CoreResultsRoute";
import { CoreAccessPage } from "./site/pages/CoreAccessPage";

function SiteFrame({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <SiteFrame>
              <HomePage />
            </SiteFrame>
          }
        />
        <Route
          path="/what-we-do"
          element={
            <SiteFrame>
              <WhatWeDoPage />
            </SiteFrame>
          }
        />
        <Route
          path="/platform"
          element={
            <SiteFrame>
              <PlatformApproachPage />
            </SiteFrame>
          }
        />
        <Route
          path="/oasis"
          element={
            <SiteFrame>
              <OasisSuitePage />
            </SiteFrame>
          }
        />
        <Route
          path="/oasis/:moduleId"
          element={
            <SiteFrame>
              <OasisModulePage />
            </SiteFrame>
          }
        />
        <Route
          path="/mvp-status"
          element={
            <SiteFrame>
              <MvpStatusPage />
            </SiteFrame>
          }
        />
        <Route
          path="/about"
          element={
            <SiteFrame>
              <AboutPage />
            </SiteFrame>
          }
        />
        <Route
          path="/contact"
          element={
            <SiteFrame>
              <ContactPage />
            </SiteFrame>
          }
        />
        <Route
          path="/core/access"
          element={
            <SiteFrame>
              <CoreAccessPage />
            </SiteFrame>
          }
        />

        <Route path="/core" element={<CoreFlowShell />}>
          <Route path="start" element={<CoreStartRoute />} />
          <Route path="onboarding" element={<CoreOnboardingRoute />} />
          <Route path="acma" element={<CoreAcmaRoute />} />
          <Route path="results" element={<CoreResultsRoute />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}