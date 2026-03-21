import React, { useEffect, useState } from "react";
import "../styles/file-upload.css";
import { medicalApi } from "../../../../lib/api";

const options = [
  {
    label: "Attach existing Record",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
      </svg>
    ),
  },
  {
    label: "Upload new document",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </svg>
    ),
  },
  {
    label: "Upload scan",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
];

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

  useEffect(() => {
    if (showMenu) {
      medicalApi
        .getRecentDocuments(3)
        .then(setRecentDocs)
        .catch(() => setRecentDocs([]));
    }
  }, [showMenu]);

  return (
    <>
      <span
        className="upload-options-label"
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu((v) => !v);
        }}
      >
        {children}
      </span>
      {showMenu && (
        <div
          className="upload-container"
          onMouseLeave={() => setShowMenu(false)}
        >
          <div className="upload-options-header">
            <h6 className="upload-options-header-title">Quick Actions</h6>
          </div>
          {options.map((option, index) => (
            <button
              key={index}
              className="custom-button"
              onClick={() => {
                if (option.label.includes("Upload new")) {
                  onUploadNew?.();
                }
                setShowMenu(false);
              }}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
          <div className="upload-options-header">
            <h6 className="upload-options-header-title">Recent Uploads</h6>
          </div>
          {recentDocs.length === 0 ? (
            <div
              className="file-item"
              style={{ opacity: 0.6, fontSize: "0.75rem" }}
            >
              No recent uploads yet.
            </div>
          ) : (
            recentDocs.map((doc) => (
              <div className="file-item" key={doc.id}>
                <div className="file-item-icon">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div className="file-item-info">
                  <h6 className="file-item-name">
                    {doc.type.replace("_", " ")}
                  </h6>
                  <p className="file-item-date">
                    {new Date(doc.date).toLocaleDateString()}
                  </p>
                </div>
                <button
                  className="attach-file"
                  onClick={() => {
                    onAttachExisting?.(doc.id);
                    setShowMenu(false);
                  }}
                >
                  +
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
};

export default FileUploadOptions;
