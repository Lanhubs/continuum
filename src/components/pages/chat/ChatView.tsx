import React, { useEffect, useRef, useState } from "react";
import "./styles/ChatView.css";
import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";
import ChatDocumentIntelligence from "./components/ChatDocumentIntelligence";
import { useMedicalStore } from "../../../stores/medical-store";
import { medicalApi } from "../../../lib/api";
import type { MedicalRecord } from "../../../types/medical";

interface Message {
  type: "ai" | "user";
  content: string;
  timestamp: string;
}

const ChatView: React.FC = () => {
  const {
    history,
    fetchHistory,
    startInterpretation,
    pollScanStatus,
    activeScan,
  } = useMedicalStore();
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [sessionDocs, setSessionDocs] = useState<MedicalRecord[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedBriefingDoc, setSelectedBriefingDoc] =
    useState<MedicalRecord | null>(null);
  const [localFileUrl, setLocalFileUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const historyEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (history.length === 0) fetchHistory();
  }, [history.length, fetchHistory]);

  // Track scanning completion to add to session docs
  useEffect(() => {
    if (
      pendingFile &&
      activeScan?.status.status === "Ready" &&
      history.length > 0
    ) {
      const newest = history[0];
      if (!sessionDocs.some((d) => d.id === newest.id)) {
        setSessionDocs((prev) => [...prev, newest]);
        setSelectedBriefingDoc(newest); // Auto-show briefing for newly scanned doc
        setPendingFile(null);
        // We keep localFileUrl for consistency or clear it if the doc has a remote img
      }
    }
  }, [activeScan, history, pendingFile, sessionDocs]);

  // Initialize with AI greeting based on latest doc
  useEffect(() => {
    if (history.length > 0 && messages.length === 0) {
      const latestDoc = history[0];
      setMessages([
        {
          type: "ai",
          content: `I've analyzed your **${latestDoc.type.replace("_", " ")}** from ${new Date(latestDoc.date).toLocaleDateString()}. ${latestDoc.summary_message} — What would you like to know?`,
          timestamp: "AI Health Partner | Just now",
        },
      ]);
    }
  }, [history, messages.length]);

  // Scroll to bottom on new messages
  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (text: string, file?: File, type?: string) => {
    if (!text.trim() && !file) return;

    // Build context reference if we have session docs
    const docContext =
      sessionDocs.length > 0
        ? ` (Context: ${sessionDocs.map((d) => d.type).join(", ")})`
        : "";

    const typeLabel =
      type && type !== "AUTO" ? ` [Type: ${type.replace("_", " ")}]` : "";
    const contentText =
      text + (file ? ` [Scanning: ${file.name}${typeLabel}]` : "") + docContext;
    const userMsg: Message = {
      type: "user",
      content: contentText,
      timestamp: `You • ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const { reply, session_id } = await medicalApi.sendChat(
        text,
        sessionId,
        file,
        type,
      );
      setSessionId(session_id);
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          content: reply,
          timestamp: `AI Health Partner | ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          content: "I couldn't reach the server. Please try again.",
          timestamp: "Error",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setLocalFileUrl(URL.createObjectURL(file));
    const id = await startInterpretation(file);
    pollScanStatus(id);
  };

  const triggerFileUpload = () => {
    fileRef.current?.click();
  };

  const handleAttachExisting = (docId: string) => {
    const doc = history.find((d) => d.id === docId);
    if (doc && !sessionDocs.some((d) => d.id === docId)) {
      setSessionDocs((prev) => [...prev, doc]);
    }
  };

  const removeDoc = (id: string) => {
    setSessionDocs((prev) => prev.filter((d) => d.id !== id));
  };

  const recentDocs = history.slice(0, 3);

  return (
    <div className="chat-view-container">
      {/* Left Sidebar — Context & Attachments */}
      <aside className="chat-sidebar">
        <div className="sidebar-section">
          <p className="sidebar-section-label">Medical Context</p>
          <div className="sidebar-context-list">
            {recentDocs.length > 0 ? (
              recentDocs.map((doc, i) => (
                <div
                  className="sidebar-doc-chip"
                  onClick={() => setSelectedBriefingDoc(doc)}
                  key={doc.id}
                >
                  <span className="material-symbols-outlined chip-icon">
                    description
                  </span>
                  <div
                    className="chip-info"
                    onClick={() => setSelectedBriefingDoc(doc)}
                  >
                    <p className="chip-name">
                      {doc.type.replace("_", " ")} Report
                    </p>
                    <p className="chip-meta">
                      {i === 0
                        ? "Latest"
                        : new Date(doc.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="sidebar-empty-text">
                No records yet. Upload a document to begin.
              </p>
            )}
          </div>
        </div>

        {(pendingFile || sessionDocs.length > 0) && (
          <div className="sidebar-section">
            <p className="sidebar-section-label">Active in Chat</p>
            <div className="sidebar-context-list">
              {pendingFile && (
                <div className="sidebar-doc-chip active">
                  <span className="material-symbols-outlined chip-icon">
                    cloud_upload
                  </span>
                  <div className="chip-info">
                    <p className="chip-name">{pendingFile.name}</p>
                    <p className="chip-meta">
                      {activeScan
                        ? `${activeScan.status.status}… ${activeScan.status.progress}%`
                        : "Processing…"}
                    </p>
                  </div>
                </div>
              )}
              {sessionDocs.map((doc) => (
                <div className="sidebar-doc-chip active" key={doc.id}>
                  <span className="material-symbols-outlined chip-icon">
                    task_alt
                  </span>
                  <div className="chip-info">
                    <p className="chip-name">{doc.type.replace("_", " ")}</p>
                    <p className="chip-meta">Attached</p>
                  </div>
                  <button
                    onClick={() => removeDoc(doc.id)}
                    className="chip-remove"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Main Chat Area component*/}
      <div className="chat-main">
        {(selectedBriefingDoc || activeScan) && (
          <div className="briefing-overlay">
            <div className="briefing-content">
              <button
                className="close-briefing"
                onClick={() => {
                  setSelectedBriefingDoc(null);
                  setLocalFileUrl(null);
                }}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              <ChatDocumentIntelligence
                document={selectedBriefingDoc}
                localFileUrl={localFileUrl}
                titleOverride={selectedBriefingDoc ? `Intelligence: ${selectedBriefingDoc.type.replace("_", " ")}` : "Analyzing Document..."}
              />
            </div>
          </div>
        )}

        <header className="chat-view-header">
          <div className="header-icon">
            <span className="material-symbols-outlined">auto_awesome</span>
          </div>
          <div>
            <h1 className="header-title">Discuss with AI</h1>
            <p className="header-subtitle">
              Your private encrypted consultation assistant.
            </p>
          </div>

          <div className="header-actions">
            <div className="secure-badge">
              <span className="status-dot"></span>
              SECURE LINK ACTIVE
            </div>
          </div>

          {activeScan && activeScan.status.status !== "Ready" && (
            <div className="processing-indicator">
              <span className="processing-dot"></span>
              <span className="processing-text">Analyzing markers…</span>
            </div>
          )}
        </header>

        <div className="chat-history">
          {messages.map((msg, i) => (
            <ChatMessage
              key={i}
              type={msg.type}
              content={msg.content}
              timestamp={msg.timestamp}
            />
          ))}

          {/* Active Scan Progress Message */}
          {activeScan && activeScan.status.status !== "Ready" && (
            <ChatMessage
              type="ai"
              content={`Analyzing your ${activeScan.fileName.replace(".pdf", "").replace(".png", "").replace(".jpg", "")}... ${activeScan.status.progress}%\nProcessing visual markers and metadata tags for diagnostic patterns...`}
              timestamp="AI Health Partner | Progress"
            />
          )}

          {isTyping && (
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
          <div ref={historyEndRef} />
        </div>

        {/* Session Document Chips (Above Input) */}
        {sessionDocs.length > 0 && (
          <div className="session-docs-row">
            {sessionDocs.map((doc) => (
              <div key={doc.id} className="session-doc-badge">
                <span className="material-symbols-outlined">description</span>
                {doc.type.replace("_", " ")}
                <button onClick={() => removeDoc(doc.id)}>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "14px" }}
                  >
                    close
                  </span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pending File Preview (Bottom) */}
        {pendingFile && (
          <div style={{ padding: "0 2rem 1rem" }}>
            <div className="pending-file-card">
              <div className="pending-file-info">
                <span className="material-symbols-outlined">attach_file</span>
                <div>
                  <p className="pending-file-name">{pendingFile.name}</p>
                  <p className="pending-file-status">
                    Uploading & Processing...
                  </p>
                </div>
                <div className="hipaa-badge" style={{ marginLeft: "auto" }}>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "12px" }}
                  >
                    verified_user
                  </span>
                  HIPAA PROTECTED
                </div>
              </div>
              <div className="upload-progress-bar">
                <div
                  className="upload-progress-fill"
                  style={{
                    width: `${activeScan ? activeScan.status.progress : 15}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <ChatInput
          onSend={(message, file, type) => handleSend(message, file, type)}
          onUploadNew={() => triggerFileUpload()}
          onAttachExisting={handleAttachExisting}
        />
        <input
          type="file"
          hidden
          ref={fileRef}
          accept="image/*,application/pdf"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default ChatView;
