import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { AnalysisPage } from "./pages/AnalysisPage";
import { DigitalTwinPage } from "./pages/DigitalTwinPage";
import { ExplorerPage } from "./pages/ExplorerPage";
import { MethodsPage } from "./pages/MethodsPage";
import { OverviewPage } from "./pages/OverviewPage";
import { SurveysPage } from "./pages/SurveysPage";
import { TreeCatalogPage } from "./pages/TreeCatalogPage";
import { TreeDetailPage } from "./pages/TreeDetailPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<OverviewPage />} />
        <Route path="explorer" element={<ExplorerPage />} />
        <Route path="trees" element={<TreeCatalogPage />} />
        <Route path="trees/:treeId" element={<TreeDetailPage />} />
        <Route path="surveys" element={<SurveysPage />} />
        <Route path="digital-twin" element={<DigitalTwinPage />} />
        <Route path="analysis" element={<AnalysisPage />} />
        <Route path="methods" element={<MethodsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
