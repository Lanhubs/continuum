import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMedicalStore } from "../../../stores/medical-store";
import "./styles/RadiologyHistoryPage.css";

const RadiologyHistoryPage: React.FC = () => {
  const { history, fetchHistory } = useMedicalStore();
  const [activeFilter, setActiveFilter] = useState("All Scans");

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const radiologyHistory = history.filter(item => item.type === 'RADIOLOGY');
  
  // Sort by date descending
  radiologyHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filters = ["All Scans", "Chest", "Spine", "Limbs", "Head"];

  return (
    <div className="radiology-history-page">
      <section className="rh-header-section">
        <h2 className="rh-title">Radiology History</h2>
        <div className="rh-meta">
          <span className="rh-count-badge">{radiologyHistory.length} Scans Interpreted</span>
          <span className="rh-separator">|</span>
          <span className="rh-updated-text">Updated just now</span>
        </div>
      </section>

      <section className="rh-filters-section">
        {filters.map(f => (
          <button 
            key={f}
            className={`rh-filter-btn ${activeFilter === f ? 'active' : ''}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
        <div className="rh-sort">
          <span>Sort by:</span>
          <button className="rh-sort-btn">
            Newest <span className="material-symbols-outlined">expand_more</span>
          </button>
        </div>
      </section>

      <section className="rh-grid">
        {radiologyHistory.map(scan => {
          let icon = "medical_services";
          // Since we don't have title let's use a standard name or check markers
          const scanTitle = "Radiology Scan";
          const scanStatus = scan.markers?.[0]?.status_label || "Stable";

          return (
            <Link to={`/radiology/${scan.id}`} key={scan.id} className="rh-card">
              <div className="rh-card-header">
                <div className="rh-icon-wrapper">
                  <span className="material-symbols-outlined">{icon}</span>
                </div>
                <div className="rh-date-wrapper">
                  <span className="rh-date">{new Date(scan.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  <div className="rh-status">
                    <span className={`rh-status-dot ${scanStatus.toLowerCase() === 'stable' ? 'pulse' : ''}`}></span>
                    <span className="rh-status-text">{scanStatus}</span>
                  </div>
                </div>
              </div>
              <h3 className="rh-card-title">{scanTitle}</h3>
              <p className="rh-card-desc">
                <span className="rh-desc-label">Partner Insight</span>
                {scan.summary_message || "Insights ready for review."}
              </p>
              <div className="rh-card-footer">
                <div className="rh-file-badges">
                  <div className="rh-badge">JPG</div>
                  <div className="rh-badge">PDF</div>
                </div>
                <div className="rh-view-link">
                  View Interpretation <span className="material-symbols-outlined">arrow_forward</span>
                </div>
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
};

export default RadiologyHistoryPage;
