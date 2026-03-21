import React, { useEffect } from 'react';
import './styles/DashboardPage.css';
import StabilityCard from './components/StabilityCard';
import DocumentIntelligence from './components/DocumentIntelligence';
import { useMedicalStore } from '../../../stores/medical-store';

const DashboardPage: React.FC = () => {
  const { history, fetchHistory, isLoading } = useMedicalStore();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Extract top markers for stability overview
  const allMarkers = history.flatMap(doc => doc.markers || []);
  const topMarkers = allMarkers.slice(0, 2);

  return (
    <div className="dashboard-page">
      <div className="dashboard-grid">
        <div className="stability-section">
          <div className="section-header">
            <h2 className="section-title">Stability Grid</h2>
            <div className="last-updated">
              <span className="material-symbols-outlined">history</span>
              <span>Updated: {history.length > 0 ? "Just now" : "Fetch pending"}</span>
            </div>
          </div>

          <div className="cards-stack">
            {isLoading && history.length === 0 ? <p>Loading stability data...</p> : 
             topMarkers.map((marker) => (
              <StabilityCard
                key={marker.id}
                title={marker.name}
                subtitle={`${marker.value} ${marker.unit}`}
                value={marker.value}
                unit={marker.unit}
                labels={{
                  low: "Low",
                  safe: `Safe (${marker.reference_range})`,
                  high: "High",
                }}
                ranges={{ low: 10, safeStart: 30, safeWidth: 40, high: 80 }}
                markerPosition={marker.stability_score}
                icon="psychiatry"
                insight={marker.interpretation}
              />
            ))}
            {!isLoading && topMarkers.length === 0 && <p className="empty">No stability data available yet.</p>}
          </div>
        </div>

        <div className="intelligence-section">
          <DocumentIntelligence />
        </div>
      </div>

     
    </div>
  );
};

export default DashboardPage;
