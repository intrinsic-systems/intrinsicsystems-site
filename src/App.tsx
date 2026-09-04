import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "./site/pages/HomePage";
import { OasisSuitePage } from "./site/pages/OasisSuitePage";
import { AboutPage } from "./site/pages/AboutPage";
import { ContactPage } from "./site/pages/ContactPage";

export default function App() {
  return <BrowserRouter><Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/oasis" element={<OasisSuitePage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></BrowserRouter>;
}
