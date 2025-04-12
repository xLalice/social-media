import React from 'react';
import { Link } from 'react-router-dom';
import { useUser, useLogout } from '../hooks/useAuth';

const NavBar: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useUser();
  const { logout } = useLogout();
  
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Social App</Link>
      </div>
      
      <div className="navbar-menu">
        {isLoading ? (
          <div className="navbar-loading">Loading...</div>
        ) : isAuthenticated ? (
          <>
            <Link to="/" className="navbar-item">Home</Link>
            <Link to="/profile" className="navbar-item">Profile</Link>
            
            <div className="navbar-dropdown">
              <button className="navbar-avatar">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="Profile" />
                ) : (
                  <div className="avatar-placeholder">
                    {user?.name?.[0] || user?.email?.[0] || 'U'}
                  </div>
                )}
              </button>
              
              <div className="dropdown-content">
                <div className="dropdown-user-info">
                  <p className="user-name">{user?.name}</p>
                  <p className="user-email">{user?.email}</p>
                </div>
                <hr />
                <button className="dropdown-item" onClick={() => logout()}>
                  Sign Out
                </button>
              </div>
            </div>
          </>
        ) : (
          <Link to="/login" className="navbar-item btn-login">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;