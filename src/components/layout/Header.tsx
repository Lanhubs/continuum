import "./Header.css";
import { useLocation } from "react-router-dom";
import Branding from "./Branding";
import { useAuthStore } from "../../stores/auth-store";

const Header: React.FC = () => {
  const location = useLocation();
  const { user } = useAuthStore();

  return (
    <header className="header glass">
      {/* <Branding className="mobile-brand" /> */}
      
      <div className="header-content">
        {location.pathname === "/lab-tests" ? (
          <div className="header-top">
            <h1 className="page-title">Lab Tests</h1>
            <div className="test-search-wrapper">
              <span className="material-symbols-outlined">search</span>
              <input type="text" placeholder="Search tests..." title="Search tests" />
            </div>
          </div>
        ) : location.pathname === "/prescriptions" ? (
          <div className="header-top">
            <div className="header-text">
              <h3 className="page-title" style={{fontSize: "1.5rem"}}>Prescriptions</h3>
              <p className="page-subtitle">Manage treatment plans</p>
            </div>
            <div className="header-actions">
              <div className="search-wrapper">
                <span className="material-symbols-outlined search-icon">search</span>
                <input type="text" placeholder="Search..." className="search-input" title="Search medications" />
              </div>
            </div>
          </div>
        ) : (
          <div className="greeting-container desktop-only">
            <h1 className="greeting">
              Good evening, <span className="highlight">Habeebullah.</span>
            </h1>
          </div>
        )}
      </div>

      <div className="header-right">
        <div className="notification-wrapper">
          <span className="material-symbols-outlined notification-icon">notifications</span>
          <div className="notification-badge"></div>
        </div>

        {user && (
          <div className="mobile-user-profile">
            <div className="user-avatar">
              <img 
                src={user.image || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name)} 
                alt={user.name} 
              />
            </div>
          </div>
        )}

        <div className="desktop-only divider"></div>
        
        <p className="status-msg desktop-only">
          "Your medical partner has analyzed your latest documents."
        </p>
      </div>
    </header>
  );
};

export default Header;
