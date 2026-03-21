

import React from 'react';
import './styles/ContextSidebar.css';
import { useMedicalStore } from '../../../stores/medical-store';

const ContextSidebar: React.FC = () => {
  const { history } = useMedicalStore();
  const latestDoc = history[0];
  const markers = latestDoc?.markers || [];

  return (
    <aside className="context-sidebar">
      <h3 className="section-label">Referenced Data</h3>
      
      <div className="referenced-stack">
        {markers.slice(0, 2).map((marker) => (
          <div key={marker.id} className="context-card mini-stat">
            <div className="card-top">
              <span className="card-label">{marker.name}</span>
              <span className={`card-val ${marker.status_color !== 'forest-green' ? 'highlight' : ''}`}>
                {marker.value} <small>{marker.unit}</small>
              </span>
            </div>
            <div className="mini-meter">
              <div className="mini-safe" style={{ left: '30%', width: '40%' }}></div>
              <div className="mini-marker" style={{ left: `${marker.stability_score}%` }}></div>
            </div>
            {marker.status_color !== 'forest-green' && (
              <div className="mini-labels">
                <span>Low</span>
                <span className="p-text">Safe</span>
                <span>High</span>
              </div>
            )}
          </div>
        ))}

        {latestDoc && (
          <div className="doc-preview">
            <div 
              className="doc-thumb" 
              style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBy53UdAa3ZXoBlux1CCDo2rsJFa-Ls9PJshCzQUUHVMMpR-t-_SAdokKkJUrdcgxAA1iylxXKB-M6GHwNcIW7cxBNwJYMHqzjhsW5PZn5RGDYpgyyQROCGKBd0ol7rcejHL20dyVoNz9yyE2UUlaOAjOGfWn5MKi1cVR-CqhEwEDWMdSJY4qFKplBCkh7uR8zqeXisq5QGnMgbNr2JMBn80UsQSGIQdnfXnOWLo6jLnxKFD2NpyLCEW5lslN2Kl5f8bAgU9Z2J2NYu')` }}
            >
              <div className="thumb-overlay">
                <div className="doc-meta">
                  <span className="material-symbols-outlined x-small">picture_as_pdf</span>
                  <span className="meta-text">{latestDoc.type.replace('_', ' ')} Report</span>
                </div>
                <p className="status-text">Analyzed on {new Date(latestDoc.date).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}

        <div className="active-context-note">
          <p className="note-label">Active Context</p>
          <p className="note-text">
            {latestDoc 
              ? `Analyzing ${markers.length} markers from your ${latestDoc.type.toLowerCase()} report.`
              : "No active context. Upload a report to begin analysis."}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default ContextSidebar;
