// src/pages/LoginPage.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useUser } from '../hooks/useAuth';

const LoginPage: React.FC = () => {
  const { loginWithGoogle, loginWithGithub, error } = useAuthStore();
  const { isAuthenticated, isLoading } = useUser();
  
  // Redirect if already logged in
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Welcome Back</h1>
        <p>Sign in to access your account</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="oauth-buttons">
          <button 
            className="btn btn-google" 
            onClick={loginWithGoogle}
            disabled={isLoading}
          >
            <svg viewBox="0 0 24 24" className="btn-icon">
              {/* Google icon SVG path */}
            </svg>
            Continue with Google
          </button>
          
          <button 
            className="btn btn-github" 
            onClick={loginWithGithub}
            disabled={isLoading}
          >
            <svg viewBox="0 0 24 24" className="btn-icon">
              {/* GitHub icon SVG path */}
            </svg>
            Continue with GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;