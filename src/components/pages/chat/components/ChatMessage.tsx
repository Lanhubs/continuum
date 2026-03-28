import React from 'react';
import '../styles/ChatMessage.css';

interface ChatMessageProps {
  type: 'ai' | 'user';
  content: string;
  timestamp: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ type, content, timestamp }) => {
  // Simple markdown-to-html helper for bold and italic
  const renderContent = (text: string) => {
    return text.split(/(\*\*.*?\*\*|\*.*?\*)/g).map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  return (
    <div className={`message-container ${type}-msg`}>
      <div className="message-avatar">
        {type === 'ai' ? (
          <div className="ai-icon-new">
            <span className="material-symbols-outlined">clinical_notes</span>
          </div>
        ) : (
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA54G_fVGX4z0NzbD8N_5bS6dZMuqxf6jtuepykvjFSYk9hWeMRFhASG9E34rQ4e97UekoGNs6uI1-d2Ey8TNwfHuDf_KeeYX2Lut572BHUYhCTfmpy2wByg-gSLVWHIjVdgtRwm3KbL8o5asZmQqkLalw22Ccsg3C32Nk75UB2DYyo-loMWJkoDRQTA8lWdzlqEn4Ch4KXYx4HHiqvL_e7R_zCnRQyGDmVetM6VssVXs3dT-xxxNMcjvtnmrofbbCX474dGKlMSZUt" 
            alt="User" 
          />
        )}
      </div>
      <div className="message-content-wrapper">
        <div className="message-bubble">
          {content.includes('Analyzing your') && content.includes('%') ? (
            <div className="analysis-progress-content">
               <div className="analysis-header">
                  <p className="analysis-title">{renderContent(content.split('...')[0] + '...')}</p>
                  <span className="analysis-percentage">
                    {content.match(/(\d+)%/) ? content.match(/(\d+)%/)![0] : ''}
                  </span>
               </div>
               <div className="analysis-progress-container">
                  <div className="analysis-progress-bar">
                     <div className="analysis-progress-fill" style={{ width: content.match(/(\d+)%/) ? content.match(/(\d+)%/)![0] : '0%' }}></div>
                  </div>
               </div>
               {content.includes('\n') && (
                 <p className="analysis-subtext">{content.split('\n')[1]}</p>
               )}
            </div>
          ) : (
            <p className="message-text">{renderContent(content)}</p>
          )}
        </div>
        <span className="message-time">{timestamp}</span>
      </div>
    </div>
  );
};

export default ChatMessage;
