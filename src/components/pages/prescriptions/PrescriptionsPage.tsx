import React, { useEffect } from "react";
import "./styles/PrescriptionsPage.css";
import PrescriptionCard from "./components/PrescriptionCard";
import { useMedicalStore } from "../../../stores/medical-store";

type TabType = "active" | "completed" | "archived";

const PrescriptionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<TabType>("active");
  const { prescriptions, isLoading, error, fetchPrescriptions, startInterpretation, pollScanStatus, activeScan } = useMedicalStore();

  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  const medications = prescriptions.flatMap(p => {
    // Splits "Med1 - Dose1 | Med2 - Dose2" into individual cards
    const segments = p.summary_message.split(' | ');
    return segments.map(seg => {
      const [name, dosage] = seg.split(' - ');
      return {
        name: name?.trim() || "Unknown Medication",
        dosage: dosage?.trim() || "As prescribed",
        instructions: "See details",
        status: (p.overall_stability > 80 ? 'active' : 'completed') as any,
        insight: p.summary_message,
        prescribedDate: new Date(p.date).toLocaleDateString(),
        refillInfo: "Check records",
        icon: "medication"
      };
    });
  });

  const filteredMedications = medications.filter((med) => {
    if (activeTab === "active") return med.status === "active";
    if (activeTab === "completed") return med.status === "completed";
    return false;
  });

  if (isLoading && prescriptions.length === 0) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="prescriptions-container">
      <div className="prescriptions-main">
        <div className="tabs-nav">
          <button
            className={`tab-item ${activeTab === "active" ? "active" : ""}`}
            onClick={() => setActiveTab("active")}
          >
            Active Medications (2)
          </button>
          <button
            className={`tab-item ${activeTab === "completed" ? "active" : ""}`}
            onClick={() => setActiveTab("completed")}
          >
            Completed
          </button>
          <button
            className={`tab-item ${activeTab === "archived" ? "active" : ""}`}
            onClick={() => setActiveTab("archived")}
          >
            Archived
          </button>
        </div>

        <div className="medications-list">
          {activeScan && (
             <div className="scan-progress-floating" style={{ marginBottom: '20px', padding: '15px', background: 'rgba(57, 192, 114, 0.1)', borderRadius: '12px' }}>
                <p style={{ margin: 0, fontWeight: 600 }}>{activeScan.status.status}... {activeScan.status.progress}%</p>
                <div className="progress-bar-bg" style={{ height: '6px', background: '#eee', marginTop: '8px', borderRadius: '3px' }}>
                   <div className="progress-bar-fill" style={{ height: '100%', width: `${activeScan.status.progress}%`, background: '#39C072', borderRadius: '3px' }}></div>
                </div>
             </div>
          )}
          {filteredMedications.map((med, index) => (
            <PrescriptionCard key={index} {...med} />
          ))}
        </div>
      </div>

      <aside className="prescriptions-sidebar">
        <section className="sidebar-section">
          <h4 className="section-label">Quick Actions</h4>
          <div className="action-buttons">
            <label className="action-btn-styled primary-ghost">
              <div className="btn-icon-bg">
                <span className="material-symbols-outlined">add_box</span>
              </div>
              <span>New Prescription</span>
              <input 
                type="file" 
                hidden 
                accept="image/*" 
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const id = await startInterpretation(file, 'PRESCRIPTION');
                    pollScanStatus(id);
                  }
                }} 
              />
            </label>
            <button className="action-btn-styled secondary-ghost">
              <div className="btn-icon-bg">
                <span className="material-symbols-outlined">history</span>
              </div>
              <span>Refill History</span>
            </button>
          </div>
        </section>

        <section className="sidebar-section">
          <h4 className="section-label">Pharmacy Info</h4>
          <div className="pharmacy-card">
            <div className="pharmacy-header">
              <span className="material-symbols-outlined">local_pharmacy</span>
              <div>
                <p className="pharmacy-name">Green Oaks Pharmacy</p>
                <p className="pharmacy-address">422 Medical Drive, Suite 100</p>
                <p className="pharmacy-address">Portland, OR 97204</p>
              </div>
            </div>
            <div className="pharmacy-stats">
              <div className="stat-row">
                <span className="presc-stat-label">Phone</span>
                <span className="presc-stat-value">(503) 555-0198</span>
              </div>
              <div className="stat-row">
                <span className="presc-stat-label">Hours</span>
                <span className="presc-stat-value">8:00 AM - 7:00 PM</span>
              </div>
            </div>

            <button className="change-pharmacy-btn">Change Pharmacy</button>
          </div>
        </section>
        <section className="consultation-box">
          <div className="consultation-content">
            <h4 className="consultation-title">Need a consultation?</h4>
            <p className="consultation-text">
              Discuss your medications with a specialist today.
            </p>
            <button className="book-btn">Book Now</button>
          </div>
        </section>
      </aside>
    </div>
  );
};

export default PrescriptionsPage;
