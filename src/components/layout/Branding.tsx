import React from 'react';
import logo from "../../assets/stryde logo.png"
const Branding: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`brand ${className}`}>
       <img src={logo} alt="stryde" className='brand-logo' />
    </div>
  );
};

export default Branding;
