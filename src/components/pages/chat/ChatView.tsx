import React, { useEffect, useRef, useState } from "react";
import "./styles/ChatView.css";
import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";
import DocumentIntelligence from "../dashboard/components/DocumentIntelligence";
import { useMedicalStore } from "../../../stores/medical-store";
import { medicalApi } from "../../../lib/api";
import type { MedicalRecord } from "../../../types/medical";

interface Message {
  type: "ai" | "user";
  content: string;
  timestamp: string;
}

const ChatView: React.FC = () => {
  const { history, fetchHistory, startInterpretation, pollScanStatus, activeScan } = useMedicalStore();
  const [isDragging, setIsDragging] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [sessionDocs, setSessionDocs] = useState<MedicalRecord[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedBriefingDoc, setSelectedBriefingDoc] = useState<MedicalRecord | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const historyEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (history.length === 0) fetchHistory();
  }, [history.length, fetchHistory]);

  // Track scanning completion to add to session docs
  useEffect(() => {
    if (pendingFile && activeScan?.status.status === 'Ready' && history.length > 0) {
      const newest = history[0];
      if (!sessionDocs.some(d => d.id === newest.id)) {
        setSessionDocs(prev => [...prev, newest]);
        setSelectedBriefingDoc(newest); // Auto-show briefing for newly scanned doc
        setPendingFile(null);
      }
    }
  }, [activeScan, history, pendingFile, sessionDocs]);

  // Initialize with AI greeting based on latest doc
  useEffect(() => {
    if (history.length > 0 && messages.length === 0) {
      const latestDoc = history[0];
      setMessages([{
        type: "ai",
        content: `I've analyzed your **${latestDoc.type.replace('_', ' ')}** from ${new Date(latestDoc.date).toLocaleDateString()}. ${latestDoc.summary_message} — What would you like to know?`,
        timestamp: "AI Health Partner | Just now",
      }]);
    }
  }, [history, messages.length]);

  // Scroll to bottom on new messages
  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (text: string, file?: File, type?: string) => {
    if (!text.trim() && !file) return;

    // Build context reference if we have session docs
    const docContext = sessionDocs.length > 0 
      ? ` (Context: ${sessionDocs.map(d => d.type).join(", ")})` 
      : "";

    const typeLabel = type && type !== 'AUTO' ? ` [Type: ${type.replace('_', ' ')}]` : "";
    const contentText = text + (file ? ` [Scanning: ${file.name}${typeLabel}]` : "") + docContext;
    const userMsg: Message = {
      type: "user",
      content: contentText,
      timestamp: `You • ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const { reply, session_id } = await medicalApi.sendChat(text, sessionId, file, type);
      setSessionId(session_id);
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          content: reply,
          timestamp: `AI Health Partner | ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { type: "ai", content: "I couldn't reach the server. Please try again.", timestamp: "Error" },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    setPendingFile(file);
    const id = await startInterpretation(file);
    pollScanStatus(id);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    const id = await startInterpretation(file);
    pollScanStatus(id);
  };

  const triggerFileUpload = () => {
    fileRef.current?.click();
  };

  const handleAttachExisting = (docId: string) => {
    const doc = history.find(d => d.id === docId);
    if (doc && !sessionDocs.some(d => d.id === docId)) {
      setSessionDocs(prev => [...prev, doc]);
    }
  };

  const removeDoc = (id: string) => {
    setSessionDocs(prev => prev.filter(d => d.id !== id));
  };

  const recentDocs = history.slice(0, 3);

  return (
    <div className="chat-view-container">
      {/* Left Sidebar — Context & Attachments */}
      <aside className="chat-sidebar">
        <div className="sidebar-section">
          <p className="sidebar-section-label">Medical Context</p>
          <div className="sidebar-context-list">
            {recentDocs.length > 0 ? recentDocs.map((doc, i) => (
              <div className="sidebar-doc-chip" onClick={()=>setSelectedBriefingDoc(doc)} key={doc.id}>
                <span className="material-symbols-outlined chip-icon">description</span>
                <div className="chip-info" onClick={() => setSelectedBriefingDoc(doc)}>
                  <p className="chip-name">{doc.type.replace('_', ' ')} Report</p>
                  <p className="chip-meta">{i === 0 ? 'Latest' : new Date(doc.date).toLocaleDateString()}</p>
                </div>
                
              </div>
            )) : (
              <p className="sidebar-empty-text">No records yet. Upload a document to begin.</p>
            )}
          </div>
        </div>

        {(pendingFile || sessionDocs.length > 0) && (
          <div className="sidebar-section">
            <p className="sidebar-section-label">Active in Chat</p>
            <div className="sidebar-context-list">
              {pendingFile && (
                <div className="sidebar-doc-chip active">
                  <span className="material-symbols-outlined chip-icon">cloud_upload</span>
                  <div className="chip-info">
                    <p className="chip-name">{pendingFile.name}</p>
                    <p className="chip-meta">{activeScan ? `${activeScan.status.status}… ${activeScan.status.progress}%` : 'Processing…'}</p>
                  </div>
                </div>
              )}
              {sessionDocs.map(doc => (
                <div className="sidebar-doc-chip active" key={doc.id}>
                  <span className="material-symbols-outlined chip-icon">task_alt</span>
                  <div className="chip-info">
                    <p className="chip-name">{doc.type.replace('_', ' ')}</p>
                    <p className="chip-meta">Attached</p>
                  </div>
                  <button onClick={() => removeDoc(doc.id)} className="chip-remove">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Main Chat Area */}
      <div className="chat-main">
        {selectedBriefingDoc && (
          <div className="briefing-overlay">
            <div className="briefing-content">
              <button 
                className="close-briefing" 
                onClick={() => setSelectedBriefingDoc(null)}
              >
                <span className="material-symbols-outlined">close</span>
                Close Visual Briefing
              </button>
              <DocumentIntelligence 
                document={selectedBriefingDoc} 
                titleOverride={`Intelligence: ${selectedBriefingDoc.type.replace('_', ' ')}`}
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
            <p className="header-subtitle">Your private encrypted consultation assistant.</p>
          </div>
          {activeScan && activeScan.status.status !== 'Ready' && (
            <div className="processing-indicator">
              <span className="processing-dot"></span>
              <span className="processing-text">Analyzing markers…</span>
            </div>
          )}
        </header>

        <div className="chat-history">
          {messages.map((msg, i) => (
            <ChatMessage key={i} type={msg.type} content={msg.content} timestamp={msg.timestamp} />
          ))}
          {isTyping && (
            <div className="typing-indicator">
              <span></span><span></span><span></span>
            </div>
          )}
          <div ref={historyEndRef} />
        </div>

        {/* Upload Zone */}
        {!pendingFile && sessionDocs.length === 0 && (
          <div
            className={`upload-zone ${isDragging ? 'dragging' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={triggerFileUpload}
          >
            <input type="file" hidden ref={fileRef} accept="image/*,application/pdf" onChange={handleFileChange} />
            <span className="material-symbols-outlined upload-zone-icon">upload_file</span>
            <p className="upload-zone-title">Upload New Document</p>
            <p className="upload-zone-sub">Drag and drop your medical report here, or click to browse files.</p>
          </div>
        )}

        {/* Session Document Chips (Above Input) */}
        {sessionDocs.length > 0 && (
          <div className="session-docs-row">
            {sessionDocs.map(doc => (
              <div key={doc.id} className="session-doc-badge">
                 <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>description</span>
                 <span>{doc.type.replace('_', ' ')}</span>
                 <button onClick={() => removeDoc(doc.id)}>
                   <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>close</span>
                 </button>
              </div>
            ))}
          </div>
        )}

        <ChatInput 
          onSend={handleSend} 
          onUploadNew={triggerFileUpload}
          onAttachExisting={handleAttachExisting}
        />
      </div>
    </div>
  );
};

export default ChatView;
