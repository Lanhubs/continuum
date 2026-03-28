import React, { useRef, useState } from "react";
import "../styles/ChatInput.css";
import FileUploadOptions from "./file-upload-options";

interface ChatInputProps {
  onSend?: (message: string, file?: File, type?: string) => void;
  onUploadNew?: () => void;
  onAttachExisting?: (docId: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  onUploadNew,
  onAttachExisting,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [docType, setDocType] = useState<'AUTO' | 'LAB_RESULT' | 'PRESCRIPTION' | 'RADIOLOGY'>('AUTO');


  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const submit = () => {
    const text = value.trim();
    if (!text && !attachment) return;
    onSend?.(text, attachment || undefined, attachment ? docType : undefined);
    setValue("");
    setAttachment(null);
    setDocType('AUTO'); // Reset to auto
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div
      className="chat-input-area"
      style={{ flexDirection: "column", gap: "8px" }}
    >
      {attachment && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255,255,255,0.1)",
              padding: "4px 12px",
              borderRadius: "16px",
              fontSize: "12px",
              width: "fit-content",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "14px" }}
            >
              image
            </span>
            {attachment.name}
            <button
              onClick={() => setAttachment(null)}
              style={{
                background: "none",
                border: "none",
                color: "#ff4d4f",
                cursor: "pointer",
                padding: 0,
                display: "flex",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "14px" }}
              >
                close
              </span>
            </button>
          </div>

          <div className="doc-type-selector" style={{ display: 'flex', gap: '8px' }}>
            {([
              { id: 'AUTO', label: 'Auto-Detect', icon: 'settings_suggest' },
              { id: 'LAB_RESULT', label: 'Lab Result', icon: 'biotech' },
              { id: 'PRESCRIPTION', label: 'Prescription', icon: 'prescriptions' },
              { id: 'RADIOLOGY', label: 'Radiology Scan', icon: 'radiology' }
            ] as const).map((type) => (
              <button
                key={type.id}
                onClick={() => setDocType(type.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: docType === type.id ? 'rgba(57, 192, 114, 0.2)' : 'transparent',
                  color: docType === type.id ? '#39C072' : 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  borderColor: docType === type.id ? '#39C072' : 'rgba(255,255,255,0.1)',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{type.icon}</span>
                {type.label}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="input-wrapper">
        <div className="input-side-btn">
          <FileUploadOptions
            onUploadNew={onUploadNew}
            onAttachExisting={onAttachExisting}
          >
            <button className="attach-btn-new">
              <span className="material-symbols-outlined">attach_file</span>
            </button>
          </FileUploadOptions>
        </div>
        <textarea
          ref={textareaRef}
          rows={1}
          className="chat-field"
          placeholder="Ask Stride AI about your health..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
        />
        <div className="input-side-btn">
          <button className="send-btn-new" onClick={submit}>
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </div>

    </div>
  );

};

export default ChatInput;
