import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import OauthBtn from '../dashboard/components/oauth-btn';
import { useAuthStore } from '../../stores/auth-store';
import Branding from './Branding';


const Sidebar: React.FC = () => {
  const { user, signOut } = useAuthStore();

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <Branding />
        
        <nav className="sidebar-nav">
          <div className="nav-group">
            <p className="nav-label">Main Menu</p>
            <NavLink 
              to="/"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="material-symbols-outlined">dashboard</span>
              <span>Active Results</span>
            </NavLink>
          </div>

          <div className="nav-group">
            <p className="nav-label">Document History</p>
            <NavLink to="/lab-tests" className="nav-item">
              <span className="material-symbols-outlined">lab_research</span>
              <span>Lab Tests</span>
            </NavLink>
            <NavLink to="/prescriptions" className="nav-item">
              <span className="material-symbols-outlined">prescriptions</span>
              <span>Prescriptions</span>
            </NavLink>
            <NavLink to="/radiology" className="nav-item">
              <span className="material-symbols-outlined">radiology</span>
              <span>Radiology</span>
            </NavLink>
          </div>
        </nav>
      </div>

      <div className="sidebar-bottom">
        <button className="export-btn">
          <span className="material-symbols-outlined">ios_share</span>
          <span>Doctor Export</span>
        </button>
        
        {!user ? (
          <OauthBtn />
        ) : (
          <div className="user-profile">
            <div className="user-avatar">
              <img 
                src={user.image || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name)} 
                alt={user.name} 
              />
            </div>
            <div className="user-info">
              <p className="user-name">{user.name}</p>
              <p className="user-tier" style={{whiteSpace: "nowrap"}}>Premium Member</p>
            </div>
            <button className="logout-btn" onClick={() => signOut()} title="Sign Out">
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        )}
      </div>

    </aside>
  );
};

export default Sidebar;
