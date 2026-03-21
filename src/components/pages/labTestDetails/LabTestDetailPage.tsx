import React, { useEffect } from "react";
import "./styles/LabTestDetailPage.css";
import LabTestMetric from "./components/LabTestMetric";
import { useNavigate, useParams } from "react-router-dom";
import { useMedicalStore } from "../../../stores/medical-store";

const LabTestDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { history, fetchHistory, isLoading } = useMedicalStore();

  useEffect(() => {
    if (history.length === 0) fetchHistory();
  }, [history.length, fetchHistory]);

  const test = history.find((h) => h.id === id);

  if (isLoading && !test)
    return <div className="loading">Loading details...</div>;
  if (!test) return <div className="error">Record not found</div>;

  return (
    <div className="test-detail-page">
      <div className="detail-main-content">
        <header className="detail-header">
          <nav className="breadcrumb">
            <span
              className="breadcrumb-item"
              onClick={() => navigate("/lab-tests")}
            >
              History
            </span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">
              {test.type.replace("_", " ")}
            </span>
          </nav>
          <h1 className="detail-page-title">
            Details: {new Date(test.date).toLocaleDateString()}
          </h1>
        </header>

        <div className="summary-status-banner">
          <div className="status-icon-box">
            <span className="material-symbols-outlined">check</span>
          </div>
          <div className="status-text-content">
            <p className="status-label">
              Overall: {test.overall_stability > 80 ? "Stable" : "Needs Review"}
            </p>
            <p className="status-description">{test.summary_message}</p>
          </div>
        </div>

        <section className="marker-breakdown-section">
          <h2 className="section-header-title">Marker Breakdown</h2>
          <div className="metrics-grid">
            {test.markers?.map((marker) => (
              <LabTestMetric
                key={marker.id}
                name={marker.name}
                status={marker.status_label.toUpperCase() as any}
                value={marker.value.toString()}
                unit={marker.unit}
                rangeMin={parseInt(marker.reference_range.split("-")[0])}
                rangeMax={parseInt(marker.reference_range.split("-")[1])}
                currentValue={marker.value}
                trendData={[90, 95, 110, 105, 100, 105]} // Mock trend for now
                insight={marker.interpretation}
              />
            ))}
          </div>
        </section>

        <section className="historical-trend-section">
          <div className="trend-header">
            <h3 className="trend-title">Trend Analysis: Glucose (Fasting)</h3>
            <span className="trend-period-tag">LAST 6 MONTHS</span>
          </div>
          <div className="trend-chart-full">
            <svg
              width="100%"
              height="160"
              viewBox="0 0 800 160"
              className="trend-main-svg"
            >
              <path
                d="M50,120 L150,110 L250,90 L350,105 L450,100 L550,80 L650,60"
                fill="none"
                stroke="#12B76A"
                strokeWidth="3"
                className="main-trend-path"
              />
              <circle cx="650" cy="60" r="6" fill="#12B76A" />
              <g transform="translate(600, 10)">
                <rect width="100" height="32" rx="6" fill="#101828" />
                <text
                  x="50"
                  y="21"
                  textAnchor="middle"
                  fill="white"
                  fontSize="11"
                  fontWeight="700"
                >
                  105 mg/dL
                </text>
                <text
                  x="50"
                  y="31"
                  textAnchor="middle"
                  fill="white"
                  opacity="0.6"
                  fontSize="8"
                >
                  LAST NIGHT
                </text>
              </g>
            </svg>
            <div className="trend-xaxis">
              <span>Nov</span>
              <span>Dec</span>
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
            </div>
          </div>
        </section>
      </div>

      <aside className="ai-physician-sidebar">
        <section className="sidebar-module">
          <h3 className="module-title-serif">Report Actions</h3>
          <div className="action-button-list">
            <button className="sidebar-action-btn primary">
              <span className="material-symbols-outlined">download</span>
              <span>Download Original PDF</span>
            </button>
            <button className="sidebar-action-btn secondary">
              <span className="material-symbols-outlined">share</span>
              <span>Share with Doctor</span>
            </button>
            <button className="sidebar-action-btn secondary">
              <span className="material-symbols-outlined">group</span>
              <span>Add as Dependent</span>
            </button>
          </div>
        </section>

        <section className="sidebar-module">
          <h3 className="module-title-serif">Laboratory Info</h3>
          <div className="lab-info-sheet">
            <div className="lab-info-row">
              <span className="lab-label">Provider</span>
              <span className="lab-value">Quest Diagnostics, Seattle</span>
            </div>
            <div className="lab-info-row">
              <span className="lab-label">Collected</span>
              <span className="lab-value">May 11, 2024</span>
            </div>
            <div className="lab-info-row">
              <span className="lab-label">Order ID</span>
              <span className="lab-value">#44920-CMP</span>
            </div>
            <div className="lab-info-row">
              <span className="lab-label">Laboratory</span>
              <span className="lab-value">West Coast Medical Hub</span>
            </div>
          </div>
        </section>

        <div className="ai-assistant-card">
          <div className="ai-assistant-header">
            <div className="ai-assistant-avatar">
              <span className="material-symbols-outlined">auto_awesome</span>
            </div>
            <div className="ai-assistant-title">
              <p className="ai-assistant-name">AI Physician Assistant</p>
              <p className="ai-assistant-status">Online | Ready to assist</p>
            </div>
          </div>
          <p className="ai-assistant-intro">
            I've processed your CMP report. 14 markers were analyzed, with 12 in
            the optimal range. Would you like a breakdown of the carbohydrate
            metabolism indicators?
          </p>
          <div className="ai-action-pills">
            <button className="ai-pill">Explain Glucose</button>
            <button className="ai-pill">Compare to 2023</button>
          </div>
        </div>
      </aside>

      <button className="discuss-ai-fab">
        <span className="material-symbols-outlined">auto_awesome</span>
        <span>Discuss with AI Partner</span>
      </button>
    </div>
  );
};

export default LabTestDetailPage;
