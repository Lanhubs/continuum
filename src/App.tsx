import { useEffect } from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import ChatView from "./components/pages/chat/ChatView";
import PrescriptionsPage from "./components/pages/prescriptions/PrescriptionsPage";
import LabTestsPage from "./components/pages/labTests/LabTestsPage";
import LabTestDetailPage from "./components/pages/labTestDetails/LabTestDetailPage";
import RadiologyPage from "./components/pages/radiology/RadiologyPage";
import RadiologyHistoryPage from "./components/pages/radiologyHistory/RadiologyHistoryPage";
import DashboardPage from "./components/pages/dashboard/DashboardPage";
import { useAuthStore } from "./stores/auth-store";
import "./App.css";

function App() {
  const { fetchSession } = useAuthStore();

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/chat" element={<ChatView />} />
          <Route path="/prescriptions" element={<PrescriptionsPage />} />
          <Route path="/lab-tests" element={<LabTestsPage />} />
          <Route path="/lab-tests/:id" element={<LabTestDetailPage />} />
          <Route path="/radiology" element={<RadiologyHistoryPage />} />
          <Route path="/radiology/:id" element={<RadiologyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}

export default App;
