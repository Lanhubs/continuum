import React from 'react';
import '../styles/StabilityCard.css';

interface StabilityCardProps {
  title: string;
  subtitle: string;
  value: string | number;
  unit: string;
  labels: { low: string; safe: string; high: string };
  ranges: { low: number; safeStart: number; safeWidth: number; high: number };
  markerPosition: number; // percentage
  insight: string;
  icon: string;
}

const StabilityCard: React.FC<StabilityCardProps> = ({
  title,
  subtitle,
  value,
  unit,
  labels,
  ranges,
  markerPosition,
  insight,
  icon,
}) => {
  return (
    <div className="stat-card">
      <div className="card-header">
        <div className="title-group">
          <h3 className="card-title">{title}</h3>
          <p className="card-subtitle">{subtitle}</p>
        </div>
        <div className="value-group">
          <span className="value-main">{value}</span>
          <span className="value-unit">{unit}</span>
        </div>
      </div>

      <div className="meter-section">
        <div className="meter-labels">
          <span className="label-item">{labels.low}</span>
          <span className="label-item highlight">{labels.safe}</span>
          <span className="label-item">{labels.high}</span>
        </div>
        <div className="meter-track">
          <div 
            className="safe-zone" 
            style={{ left: `${ranges.safeStart}%`, width: `${ranges.safeWidth}%` }}
          ></div>
          <div 
            className="result-marker" 
            style={{ left: `${markerPosition}%` }}
          ></div>
        </div>
      </div>

      <div className="insight-box">
        <span className="material-symbols-outlined insight-icon">{icon}</span>
        <div className="insight-content">
          <p className="insight-title">Partner Insight</p>
          <p className="insight-text">"{insight}"</p>
        </div>
      </div>
    </div>
  );
};

export default StabilityCard;
