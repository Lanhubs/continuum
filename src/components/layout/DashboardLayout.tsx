import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./DashboardLayout.css";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === "/";

  return (
    <div className="layout-container">
      <Sidebar />
      <div className="main-wrapper">
        <Header />
        <main className="content-area">{children}</main>
        {isDashboard && (
          <footer className="footer h-24 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-10 flex items-center justify-between shrink-0">
            <div className="footer-left">
              <span className="footer-label">Next Steps</span>
              <div className="footer-chips">
                <div className="chip primary">
                  <span className="material-symbols-outlined">water_drop</span>
                  <span>Increase water intake</span>
                </div>
                <div className="chip">
                  <span className="material-symbols-outlined">
                    directions_run
                  </span>
                  <span>20min Light Walking</span>
                </div>
                <div className="chip">
                  <span className="material-symbols-outlined">
                    calendar_today
                  </span>
                  <span>Schedule Follow-up</span>
                </div>
              </div>
            </div>
            <button className="chat-btn" onClick={() => navigate("/chat")}>
              <span className="material-symbols-outlined">chat_bubble</span>
              <span>Discuss with AI Partner</span>
            </button>
          </footer>
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;
