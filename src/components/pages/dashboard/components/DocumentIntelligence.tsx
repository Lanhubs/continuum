import React from 'react';
import '../styles/DocumentIntelligence.css';
import { useMedicalStore } from '../../../../stores/medical-store';
import type { MedicalRecord } from '../../../../types/medical';

interface DocumentIntelligenceProps {
  document?: MedicalRecord;
  titleOverride?: string;
}

const DocumentIntelligence: React.FC<DocumentIntelligenceProps> = ({ document, titleOverride }) => {
  const { history } = useMedicalStore();
  const latestDoc = document || history[0];

  if (!latestDoc) return (
    <div className="doc-intelligence empty">
      <h2 className="section-title">{titleOverride || "Document Intelligence"}</h2>
      <div className="briefing-card">
        <p className="briefing-summary">No documents deciphered yet. Upload a lab report or medical script to unlock the intelligence hub.</p>
      </div>
    </div>
  );

  return (
    <div className="doc-intelligence">
      <div className="section-header">
        <h2 className="section-title">Document Intelligence Hub</h2>
        <div className="doc-date-badge">
          <span className="material-symbols-outlined">event</span>
          <span>{new Date(latestDoc.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>
      
      <div className="intelligence-hub-grid">
        {/* --- Document Scanner --- */}
        <div className="scanner-container">
          <div 
            className="scan-preview"
            style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBy53UdAa3ZXoBlux1CCDo2rsJFa-Ls9PJshCzQUUHVMMpR-t-_SAdokKkJUrdcgxAA1iylxXKB-M6GHwNcIW7cxBNwJYMHqzjhsW5PZn5RGDYpgyyQROCGKBd0ol7rcejHL20dyVoNz9yyE2UUlaOAjOGfWn5MKi1cVR-CqhEwEDWMdSJY4qFKplBCkh7uR8zqeXisq5QGnMgbNr2JMBn80UsQSGIQdnfXnOWLo6jLnxKFD2NpyLCEW5lslN2Kl5f8bAgU9Z2J2NYu')` }}
          >
            <div className="scan-overlay"></div>
            <div className="scan-line"></div>
            
            {latestDoc.markers?.map((marker, idx) => (
              <div 
                key={marker.id} 
                className="ai-hotspot" 
                style={{ 
                  top: `${20 + (idx * 15) % 60}%`, 
                  left: `${25 + (idx * 20) % 50}%` 
                }}
              >
                <div className="hotspot-dot">
                  <span className="material-symbols-outlined">biotech</span>
                </div>
                <div className="hotspot-popup">
                  <p className="tooltip-title">{marker.name}</p>
                  <p className="tooltip-text">{marker.interpretation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Briefing Panel --- */}
        <div className="briefing-panel">
          <div className="briefing-card">
            <div className="card-label">
              <span className="material-symbols-outlined">bolt</span>
              <span>Visual Briefing</span>
            </div>
            <p className="briefing-summary">{latestDoc.summary_message}</p>
          </div>

          <div className="decoder-section">
            <div className="card-label">
              <span className="material-symbols-outlined">translate</span>
              <span>Decoder: Inscriptions to Plain English</span>
            </div>
            {latestDoc.markers?.slice(0, 4).map((marker) => (
              <div key={marker.id} className="inscription-item">
                <div className="inscription-identity">
                  <span className="inscription-name">{marker.name}</span>
                  <span className="inscription-tech-label">Technical Inscription</span>
                </div>
                <div className="decoding-result">
                  <p className="decoding-text">{marker.interpretation}</p>
                  <span className="decoding-label">Decoded</span>
                </div>
              </div>
            ))}
          </div>

          <div className="briefing-card">
            <div className="card-label">
              <span className="material-symbols-outlined">tips_and_updates</span>
              <span>Actionable Intelligence</span>
            </div>
            <div className="actions-brief">
              <div className="action-pill dietary">
                <span className="material-symbols-outlined">restaurant</span>
                <div className="action-content">
                  <span className="action-type">Smart Swap (Dietary)</span>
                  <span className="action-text">{latestDoc.smart_swap_advice || "Focus on complex carbs like Ofada rice instead of white rice."}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentIntelligence;
