import React from 'react';
import '../styles/PrescriptionCard.css';

interface PrescriptionCardProps {
  name: string;
  dosage: string;
  instructions: string;
  status: 'active' | 'refill_needed' | 'completed';
  insight: string;
  prescribedDate: string;
  refillInfo: string;
  icon: string;
}

const PrescriptionCard: React.FC<PrescriptionCardProps> = ({
  name,
  dosage,
  instructions,
  status,
  insight,
  prescribedDate,
  refillInfo,
  icon
}) => {
  const getStatusLabel = () => {
    switch (status) {
      case 'active': return 'ACTIVE';
      case 'refill_needed': return 'REFILL NEEDED';
      case 'completed': return 'COMPLETED';
      default: return '';
    }
  };


  const getStatusClass = () => {
    switch (status) {
      case 'active': return 'status-active';
      case 'refill_needed': return 'status-refill';
      case 'completed': return 'status-completed';
      default: return '';
    }
  };

  return (
    <div className={`prescription-card ${status === 'completed' ? 'completed-card' : ''}`}>
      <div className="card-icon-wrapper">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      
      <div className="card-details">
        <div className="card-header">
          <div className="card-title-group">
            <h3 className="med-name">{name}</h3>
            <p className="med-dosage">{dosage} — {instructions}</p>
          </div>
          <span className={`status-badge ${getStatusClass()}`}>{getStatusLabel()}</span>
        </div>

        <div className="partner-insight-box">
          <div className="insight-header">
            <span className="material-symbols-outlined">info</span>
            <h4>PARTNER INSIGHT</h4>
          </div>

          <p className="insight-text">{insight}</p>
        </div>

        <div className="card-footer">
          <div className="meta-info">
            <span className="meta-item">
              <span className="material-symbols-outlined">calendar_today</span>
              {status === 'completed' ? 'Course ended ' : 'Prescribed: '}{prescribedDate}
            </span>
            <span className={`meta-item ${status === 'refill_needed' ? 'warning-text' : ''}`}>
              <span className="material-symbols-outlined">
                {status === 'refill_needed' ? 'error' : 'refresh'}
              </span>
              {status === 'refill_needed' ? refillInfo : `Next Refill: ${refillInfo}`}
            </span>

          </div>
          
          <div className="card-actions">
            {status === 'refill_needed' ? (
              <button className="refill-btn">Request Refill</button>
            ) : status === 'completed' ? (
              <button className="text-action">Archived Record</button>
            ) : (
              <button className="text-action">View History</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionCard;
