import React from 'react';
import '../styles/ChatDocumentIntelligence.css';
import { useMedicalStore } from '../../../../stores/medical-store';
import type { MedicalRecord } from '../../../../types/medical';

interface ChatDocumentIntelligenceProps {
  document?: MedicalRecord | null;
  localFileUrl?: string | null;
  titleOverride?: string;
}

const ChatDocumentIntelligence: React.FC<ChatDocumentIntelligenceProps> = ({ 
  document, 
  localFileUrl, 
  titleOverride 
}) => {
  const { activeScan, history } = useMedicalStore();
  
  // Use provided document or activeScan or latest from history
  const latestDoc = document || (activeScan?.status.status === 'Ready' ? history[0] : null);

  // If we have a local file URL, use it for the preview for consistency
  const previewImage = localFileUrl || (latestDoc?.raw_image_url);

  if (!latestDoc && !activeScan) return null;

  return (
    <div className="chat-doc-intelligence">
      <div className="section-header">
        <h2 className="section-title">{titleOverride || "Document Intelligence Hub"}</h2>
        {latestDoc && (
          <div className="chat-date-badge">
            <span className="material-symbols-outlined" style={{ fontSize: '14px', marginRight: '4px' }}>event</span>
            <span style={{ fontSize: '12px', fontWeight: 600 }}>
              {new Date(latestDoc.date).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
      
      <div className="chat-intelligence-grid">
        {/* --- Document Scanner --- */}
        <div className="chat-scanner-container">
          <div 
            className="chat-scan-preview"
            style={{ 
              backgroundImage: previewImage ? `url('${previewImage}')` : 'none',
              filter: activeScan && activeScan.status.status !== 'Ready' ? 'blur(4px) grayscale(50%)' : 'none',
              transition: 'all 0.5s ease'
            }}
          >
            <div className="chat-scan-overlay"></div>
            <div className="chat-scan-line"></div>
            
            {/* Markers (only if document is ready) */}
            {latestDoc?.markers?.map((marker, idx) => (
              <div 
                key={marker.id} 
                className="ai-hotspot" 
                style={{ 
                  top: `${20 + (idx * 15) % 60}%`, 
                  left: `${25 + (idx * 20) % 50}%` 
                }}
              >
                <div className="hotspot-dot">
                  <span className="material-symbols-outlined" style={{fontSize: '14px'}}>biotech</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Intelligence Panel --- */}
        <div className="chat-briefing-panel">
          <div className="chat-briefing-card">
            <div className="chat-card-label">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>bolt</span>
              <span>Visual Briefing</span>
            </div>
            <p className="chat-briefing-text">
              {latestDoc?.summary_message || (activeScan ? `Analyzing document: ${activeScan.fileName}...` : "Preparing intelligence...")}
            </p>
          </div>

          {latestDoc && latestDoc.markers && latestDoc.markers.length > 0 && (
             <div className="chat-briefing-card">
                <div className="chat-card-label">
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>translate</span>
                  <span>Decoder: Inscriptions</span>
                </div>
                <div className="chat-decoder-list">
                  {latestDoc.markers.slice(0, 3).map((marker) => (
                    <div key={marker.id} className="chat-inscription-item">
                      <span className="chat-inscription-name">{marker.name}</span>
                      <span className="chat-interpretation">{marker.interpretation}</span>
                    </div>
                  ))}
                </div>
             </div>
          )}

          {latestDoc?.smart_swap_advice && (
             <div className="chat-briefing-card">
                <div className="chat-card-label">
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>restaurant</span>
                  <span>Dietary Intelligence</span>
                </div>
                <p className="chat-briefing-text">{latestDoc.smart_swap_advice}</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatDocumentIntelligence;
