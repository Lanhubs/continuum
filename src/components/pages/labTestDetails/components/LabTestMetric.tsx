import React from "react";
import "../styles/LabTestMetric.css";

interface LabTestMetricProps {
  name: string;
  status: "OPTIMAL" | "SLIGHTLY HIGH" | "LOW" | "NORMAL" | "HIGH";
  value: string;
  unit: string;
  rangeMin: number;
  rangeMax: number;
  currentValue: number;
  trendData: number[]; // For sparkline
  insight: string;
}

const LabTestMetric: React.FC<LabTestMetricProps> = ({
  name,
  status,
  value,
  unit,
  rangeMin,
  rangeMax,
  currentValue,
  trendData,
  insight,
}) => {
  // Normalize sparkline data
  const min = Math.min(...trendData);
  const max = Math.max(...trendData);
  const range = max - min || 1;
  const points = trendData.map((v, i) => ({
    x: (i / (trendData.length - 1)) * 100,
    y: 100 - ((v - min) / range) * 100,
  }));

  const pathData = `M ${points.map((p) => `${p.x},${p.y}`).join(" L")}`;

  // Range slider position
  const sliderMin = rangeMin * 0.5;
  const sliderMax = rangeMax * 1.5;
  const sliderRange = sliderMax - sliderMin;
  const dotPosition = ((currentValue - sliderMin) / sliderRange) * 100;

  return (
    <div className="lab-metric-card">
      <div className="metric-header">
        <div className="metric-name-group">
          <h4 className="metric-name">{name}</h4>
          <span
            className={`status-badge status-${status.toLowerCase().replace(" ", "-")}`}
          >
            {status}
          </span>
        </div>
        <button className="icon-btn-tiny">
          <span className="material-symbols-outlined x-small">more_horiz</span>
        </button>
      </div>

      <div className="metric-body">
        <div className="metric-main-value">
          <div className="value-group">
            <span className="value-number">{value}</span>
            <span className="value-unit">{unit}</span>
          </div>
          <div className="sparkline-container">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="sparkline-svg"
            >
              <path d={pathData} fill="none" className="sparkline-path" />
            </svg>
          </div>
        </div>

        <div className="range-slider-section">
          <div className="range-track">
            <div
              className="range-normal-zone"
              style={{
                left: `${((rangeMin - sliderMin) / sliderRange) * 100}%`,
                width: `${((rangeMax - rangeMin) / sliderRange) * 100}%`,
              }}
            ></div>
            <div
              className={`range-dot status-${status.toLowerCase().replace(" ", "-")}`}
              style={{ left: `${Math.max(0, Math.min(100, dotPosition))}%` }}
            ></div>
          </div>
          <div className="range-labels">
            <span className="range-val">{rangeMin}</span>
            <span className="range-tag">
              NORMAL RANGE ({rangeMin}-{rangeMax})
            </span>
            <span className="range-val">{rangeMax}</span>
          </div>
        </div>
      </div>

      <div className="metric-insight">
        <div className="insight-icon-box">
          <span className="material-symbols-outlined x-small">
            auto_awesome
          </span>
        </div>
        <p className="insight-text">{insight}</p>
      </div>
    </div>
  );
};

export default LabTestMetric;
