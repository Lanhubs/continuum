import React, { useEffect } from "react";
import "./styles/RadiologyPage.css";
import { Link, useParams } from "react-router-dom";
import { useMedicalStore } from "../../../stores/medical-store";

const RadiologyPage: React.FC = () => {
  const { history, fetchHistory } = useMedicalStore();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (history.length === 0) fetchHistory();
  }, [history.length, fetchHistory]);

  const latestScan = history.find(h => h.id === id) || history.find(h => h.type === 'RADIOLOGY');
  
  // Parse radiology insight if stored in raw_text
  let radiologyInsight: any = latestScan?.radiology_insight;
  if (!radiologyInsight && latestScan?.raw_text) {
    try {
      radiologyInsight = JSON.parse(latestScan.raw_text);
    } catch (e) {
      console.warn("Failed to parse radiology insight from raw_text");
    }
  }

  // Coordinate Mapping [ymin, xmin, ymax, xmax] -> CSS style
  const getBoxStyle = (box: number[]) => {
    const [ymin, xmin, ymax, xmax] = box;
    return {
      top: `${ymin / 10}%`,
      left: `${xmin / 10}%`,
      width: `${(xmax - xmin) / 10}%`,
      height: `${(ymax - ymin) / 10}%`,
    };
  };

  return (
    <div className="radiology-page">
      <header className="radiology-header">
        <nav className="breadcrumbs">
          <Link to="/radiology">History</Link>
          <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>chevron_right</span>
          <span>Radiology Scan - {latestScan ? new Date(latestScan.date).toLocaleDateString() : "Loading..."}</span>
        </nav>
        <h2 className="page-title">Radiology Insight</h2>
      </header>

      {/* Partner Note / Safety Alert */}
      {latestScan?.ai_assistant_context?.partner_note && (
        <div className="partner-alert" style={{
          background: '#fffbe6',
          border: '1px solid #ffe58f',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '24px',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          color: '#856404'
        }}>
          <span className="material-symbols-outlined" style={{ color: '#faad14' }}>warning</span>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>
            {latestScan.ai_assistant_context.partner_note}
          </p>
        </div>
      )}

      <main className="radiology-grid">
        <section className="visuals-column">
          <div className="visual-grid">
            <div className="insight-card visual-card">
              <h3 className="card-label">Simplified Anatomy Map</h3>
              <div className="media-placeholder">
                <div className="media-icon-bg">
                  <span className="material-symbols-outlined" style={{ fontSize: '160px' }}>person</span>
                </div>
                <div className="anatomy-glow"></div>
                <div className="anatomy-target"><div className="target-dot"></div></div>
                <p className="visual-badge">{radiologyInsight?.anatomy_map?.region || "Chest"} Area Highlighted</p>
              </div>
            </div>

            <div className="insight-card visual-card">
              <h3 className="card-label">Document Preview</h3>
              <div className="preview-container" style={{ position: 'relative', overflow: 'hidden' }}>
                <div 
                   className="preview-image" 
                   style={{ 
                     backgroundImage: `url(${latestScan?.raw_image_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuDJZAY9bP-7Dd--C5_Q633f5lUt5O3Hg09f1hrHJp-dI4oaK1xB52oL-H8wU5LXwfL1O6d7PsSXr2L0R1NdxoEyu6eVsXa2tfvCN8NXMBXEY9HiVSkKWrTqbbN6ayGctpibq4OrNTCrr2PgVXzL8rqAxJ1pKwiwvVI-DkN3TnqUrBesYvQufSY3ZI0q2bGTqvh3fv__9bH4_k4lrkkLC3s9QLQQT6E6Cj2fvOQCr7jjMbyAPl5kpMM0wMzgUwCIQNQ1gkgri6PW2RFp"})`,
                     position: 'relative',
                     width: '100%',
                     height: '100%',
                     backgroundSize: 'cover',
                     backgroundPosition: 'center'
                   }}
                >
                  {/* MATHEMATICALLY ACCURATE HIGHLIGHTS */}
                  {radiologyInsight?.regions?.map((region: any, idx: number) => (
                    <div 
                      key={idx}
                      className="region-highlight"
                      style={{
                        position: 'absolute',
                        border: '2px solid #228c22',
                        backgroundColor: 'rgba(34, 140, 34, 0.1)',
                        pointerEvents: 'none',
                        ...getBoxStyle(region.box_2d)
                      }}
                    >
                      <span style={{
                        position: 'absolute',
                        top: '-20px',
                        left: '0',
                        fontSize: '10px',
                        background: '#228c22',
                        color: 'white',
                        padding: '2px 4px',
                        borderRadius: '2px'
                      }}>
                        {region.label}
                      </span>
                    </div>
                  ))}
                </div>
                
                <button className="zoom-btn">
                  <span className="material-symbols-outlined">zoom_in</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="insights-column">
          <div className="insight-card summary-card">
            <div className="summary-header">
              <span className="material-symbols-outlined">auto_awesome</span>
              <h3>Partner Summary</h3>
            </div>
            <p className="summary-text">
              {latestScan?.summary_message || "Your chest scan shows clear lungs. The minor shadow identified is a common finding and matches your recovery trend."}
            </p>
          </div>

          <div className="insight-card">
            <h3 className="card-label">Technical Translation</h3>
            <div className="translation-list">
              {radiologyInsight?.findings?.map((finding: string, idx: number) => (
                <div key={idx} className="translation-item">
                  <span className="material-symbols-outlined translation-icon">
                    check_circle
                  </span>
                  <div className="translation-content">
                    <span className="technical-term">{finding}</span>
                    <span className="human-meaning">Radiological finding observed in the scan.</span>
                  </div>
                </div>
              ))}
              {(!radiologyInsight || !radiologyInsight.findings) && (
                <>
                  <div className="translation-item">
                    <span className="material-symbols-outlined translation-icon">check_circle</span>
                    <div className="translation-content">
                      <span className="technical-term">"No acute bony abnormality"</span>
                      <span className="human-meaning">No broken bones or fractures found.</span>
                    </div>
                  </div>
                  <div className="translation-item">
                    <span className="material-symbols-outlined translation-icon">check_circle</span>
                    <div className="translation-content">
                      <span className="technical-term">"Lungs are clear bilaterally"</span>
                      <span className="human-meaning">Both your left and right lungs appear healthy.</span>
                    </div>
                  </div>
                  <div className="translation-item">
                    <span className="material-symbols-outlined translation-icon" style={{color: '#94a694'}}>info</span>
                    <div className="translation-content">
                      <span className="technical-term">"Stable non-specific density"</span>
                      <span className="human-meaning">A small shadow that hasn't changed since your last visit.</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <section className="bottom-section">
        <h3 className="bottom-title">Clinical Thread</h3>
        <div className="bottom-grid">
          <div className="correlation-widget">
            <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#228c22' }}>sync_alt</span>
            <div>
              <p className="correlation-label">Correlation Insight</p>
              <p className="correlation-text">This scan correlates with your Blood Test from March 10.</p>
            </div>
          </div>
          <div className="action-buttons">
            <button className="bottom-btn btn-primary">
              <span className="material-symbols-outlined">description</span>
              Generate Consultation Guide
            </button>
            <button className="bottom-btn btn-secondary">
              <span className="material-symbols-outlined">share</span>
              Share with Doctor
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RadiologyPage;
