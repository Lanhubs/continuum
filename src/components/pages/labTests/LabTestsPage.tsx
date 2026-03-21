import React, { useEffect } from "react";
import "./styles/LabTestsPage.css";
import LabTestCard from "./components/LabTestCard";
import { useNavigate } from "react-router-dom";
import { useMedicalStore } from "../../../stores/medical-store";

const LabTestsPage: React.FC = () => {
  const navigate = useNavigate();
  const { history, isLoading, error, fetchHistory, startInterpretation, pollScanStatus, activeScan } = useMedicalStore();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const labTests = history.filter(doc => doc.type === 'LAB_RESULT');
  
  if (isLoading && labTests.length === 0) return <div className="loading">Loading records...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="lab-tests-container">
      <div className="lab-tests-main">
        <div className="lab-tests-tabs-nav">
          {["All Tests", "Recent", "Critical", "Scheduled"].map((tab, idx) => (
            <button key={tab} className={`lab-tests-tab-item ${idx === 0 ? "active" : ""}`}>{tab}</button>
          ))}
        </div>

        <div className="tests-list">
          {labTests.length === 0 ? (
            <p className="empty-state">No lab results found. Upload a document to get started.</p>
          ) : (
            labTests.map((test) => (
              <div key={test.id} className="test-group">
                <h4 className="group-label">Blood Work & Panels</h4>
                <LabTestCard
                  title={test.summary_message}
                  status="Completed"
                  date={new Date(test.date).toLocaleDateString()}
                  doctor="Dr. Aris"
                  safeMarkers={test.markers?.filter(m => m.status_color === 'forest-green').length || 0}
                  totalMarkers={test.markers?.length || 0}
                  icon="science"
                  onClick={() => navigate(`/lab-tests/${test.id}`)}
                />
              </div>
            ))
          )}
        </div>

        <div className="missing-record-box">
          <div className="missing-content">
            <h4 className="missing-title">Missing a record?</h4>
            <p className="missing-text">Upload results to integrate them into your history.</p>
            {activeScan && (
              <div className="scan-progress">
                <p>{activeScan.status.status}... {activeScan.status.progress}%</p>
                <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: `${activeScan.status.progress}%` }}></div></div>
              </div>
            )}
          </div>
          <label className="upload-btn">
            <span className="material-symbols-outlined">upload_file</span>
            <span>{isLoading ? "Processing..." : "Upload New Document"}</span>
            <input 
              type="file" 
              hidden 
              accept="image/*" 
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const id = await startInterpretation(file, 'LAB_RESULT');
                  pollScanStatus(id);
                }
              }} 
            />
          </label>
        </div>
      </div>

      <aside className="lab-tests-sidebar">
        <section className="stats-section">
          <h4 className="sidebar-label">Quick Stats</h4>
          <div className="stat-card">
            <div className="stat-main">
              <span className="stat-title">Tests This Year</span>
              <span className="stat-value">14</span>
            </div>
            <span className="stat-trend positive">+2 from 2022</span>
          </div>
        </section>

        <section className="trends-section">
          <h4 className="sidebar-label">Health Trend (HbA1C)</h4>
          <div className="trend-box">
            <div className="trend-chart-mini">
              {[40, 65, 55, 80, 70, 90, 85].map((h, i) => (
                <div
                  key={i}
                  className="trend-bar"
                  style={{ height: `${h}%` }}
                ></div>
              ))}
            </div>
            <div className="trend-info">
              <span className="trend-percent">
                <span className="material-symbols-outlined">north</span>
                4.2%
              </span>
              <span className="trend-desc">improvement</span>
            </div>
          </div>
        </section>

        <section className="membership-promo">
          <div className="promo-content">
            <div className="promo-badge">
              <span className="material-symbols-outlined">shield_with_heart</span>
            </div>
            <h4 className="promo-title">Membership</h4>
            <p className="promo-text">
              Get faster processing and priority scheduling for all lab work.
            </p>
            <button className="upgrade-btn">View Privileges</button>
          </div>
        </section>

        <button className="book-test-btn">
          <span className="material-symbols-outlined">add</span>
          <span>Book New Test</span>
        </button>
      </aside>
    </div>
  );
};

export default LabTestsPage;
