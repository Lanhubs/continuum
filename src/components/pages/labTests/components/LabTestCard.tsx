import React from 'react';
import '../styles/LabTestCard.css';

interface LabTestCardProps {
  title: string;
  status: 'Completed' | 'Processing' | 'Scheduled';
  date: string;
  location?: string;
  doctor?: string;
  safeMarkers?: number;
  totalMarkers?: number;
  progress?: number;
  note?: string;
  icon: string;
  onClick?: () => void;
}

const LabTestCard: React.FC<LabTestCardProps> = ({
  title,
  status,
  date,
  location,
  doctor,
  safeMarkers,
  totalMarkers,
  progress,
  note,
  icon,
  onClick
}) => {
  return (
    <div className={`lab-test-card status-${status.toLowerCase()} ${onClick ? 'clickable' : ''}`} onClick={onClick}>
      <div className="card-left">
        <div className="test-icon-wrapper">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
      </div>

      <div className="card-main">
        <div className="card-header">
          <div className="title-section">
            <h3 className="test-title">{title}</h3>
            <div className="test-meta">
              <span className={`status-badge status-${status.toLowerCase()}`}>
                {status.toUpperCase()}
              </span>
              <span className="dot">•</span>
              <div className="meta-item">
                <span className="material-symbols-outlined small">calendar_today</span>
                <span className="test-date">{date}</span>
              </div>
              {(doctor || location) && (
                <>
                  <span className="dot">•</span>
                  <div className="meta-item">
                    <span className="material-symbols-outlined small">
                      {doctor ? 'person' : 'location_on'}
                    </span>
                    <span className="meta-text">{doctor || location}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {status === 'Completed' && safeMarkers !== undefined && totalMarkers !== undefined && (
          <div className="stability-summary">
            <div className="summary-header">
              <span className="summary-label">STABILITY SUMMARY</span>
              {totalMarkers > 1 ? (
                <span className="marker-count">{safeMarkers} / {totalMarkers} Markers in Safe Zone</span>
              ) : (
                <span className="marker-count">Optimal Range</span>
              )}
            </div>
            
            {totalMarkers > 1 ? (
              <div className="mini-bar-chart">
                {Array.from({ length: totalMarkers }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`bar ${i < safeMarkers ? 'safe' : 'neutral'}`} 
                    style={{ height: `${20 + (i % 3 === 0 ? 40 : i % 2 === 0 ? 60 : 30)}%` }}
                  ></div>
                ))}
              </div>
            ) : (
              <div className="checkmark-display">
                <div className="check-circle">
                  <span className="material-symbols-outlined x-small">check</span>
                </div>
                <span className="check-text">Status: Normal</span>
              </div>
            )}
          </div>
        )}

        {status === 'Processing' && progress !== undefined && (
          <div className="processing-section">
            <div className="progress-header">
              <span className="progress-label">Analysis in progress</span>
              <span className="progress-percent">{progress}%</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}

        {note && (
          <div className={`test-note-box status-${status.toLowerCase()}`}>
            <span className="material-symbols-outlined">info</span>
            <p>{note}</p>
          </div>
        )}
      </div>

      <div className="card-actions">
        <button className="icon-action-btn" onClick={(e) => { e.stopPropagation(); }}>
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </div>
    </div>
  );
};

export default LabTestCard;
