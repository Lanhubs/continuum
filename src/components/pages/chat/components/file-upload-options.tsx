import React, { useEffect, useState } from "react";
import "../styles/file-upload.css";
import { medicalApi } from "../../../../lib/api";

interface RecentDoc {
  id: string;
  type: string;
  date: string;
  summary_message: string;
}

interface FileUploadOptionsProps {
  children: React.ReactNode;
  onUploadNew?: () => void;
  onAttachExisting?: (docId: string) => void;
}

const FileUploadOptions = ({
  children,
  onUploadNew,
  onAttachExisting,
}: FileUploadOptionsProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [recentDocs, setRecentDocs] = useState<RecentDoc[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (showMenu) {
      medicalApi
        .getRecentDocuments(3)
        .then(setRecentDocs)
        .catch(() => setRecentDocs([]));
    }
  }, [showMenu]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      // In a real app, we'd trigger the upload logic from here
      onUploadNew?.();
      setShowMenu(false);
    }
  };

  return (
    <div className="upload-options-wrapper">
      <div
        className="upload-trigger"
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu((v) => !v);
        }}
      >
        {children}
      </div>

      {showMenu && (
        <>
          <div className="upload-menu-overlay" onClick={() => setShowMenu(false)} />
          <div className="upload-menu-content" onClick={(e) => e.stopPropagation()}>
            <div className="upload-container-outer">
              <div className={`upload-zone-wrapper ${isDragging ? 'dragging' : ''}`}>
                <div className="quick-attach-sidebar">
                  <p className="quick-attach-label">QUICK ATTACH</p>
                  <div className="quick-attach-menu">
                    <div className="quick-attach-item" onClick={() => { onAttachExisting?.('mock-id'); setShowMenu(false); }}>
                      <span className="material-symbols-outlined">folder</span>
                      Attach Existing Record
                    </div>
                    <div className="quick-attach-item" onClick={() => { onUploadNew?.(); setShowMenu(false); }}>
                      <span className="material-symbols-outlined">upload_file</span>
                      Upload New Document
                    </div>
                    <div className="quick-attach-item" onClick={() => { onUploadNew?.(); setShowMenu(false); }}>
                      <span className="material-symbols-outlined">photo_camera</span>
                      Upload Scan
                    </div>
                  </div>

                  <div className="recent-records-mini">
                    <p className="quick-attach-label">RECENT RECORDS</p>
                    {recentDocs.length === 0 ? (
                      <p className="sidebar-empty-text">No recent records found.</p>
                    ) : (
                      recentDocs.map(doc => (
                        <div key={doc.id} className="recent-record-item" onClick={() => { onAttachExisting?.(doc.id); setShowMenu(false); }}>
                          <span className="material-symbols-outlined">description</span>
                          <p className="record-name">{doc.type.replace('_', ' ')}.pdf</p>
                          <span className="material-symbols-outlined add-icon">add</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div
                  className="drop-zone-main"
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => { onUploadNew?.(); setShowMenu(false); }}
                >
                  <div className="cloud-icon-circle">
                    <span className="material-symbols-outlined">cloud_upload</span>
                  </div>
                  <p className="upload-zone-title">Upload New Document</p>
                  <p className="upload-zone-sub">Drag and drop your medical report here, or click to browse files.</p>
                  <div className="upload-zone-buttons">
                    <button className="upload-btn-secondary">Select PDF</button>
                    <button className="upload-btn-secondary">Select Image</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FileUploadOptions;
