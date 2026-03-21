import React from 'react';

const Branding: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`brand ${className}`}>
      <div className="brand-logo">
        <span className="material-symbols-outlined">medical_services</span>
      </div>
      <h2 className="brand-name">Medical Partner</h2>
    </div>
  );
};

export default Branding;
