// src/pages/AuthCallbackPage.tsx
import React, { useEffect } from 'react';
import { useParams, useLocation, Navigate } from 'react-router-dom';
import { useAuthCallback } from '../hooks/useAuth';

// Helper to parse URL parameters
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const AuthCallbackPage: React.FC = () => {
  const { provider } = useParams<{ provider: string }>();
  const query = useQuery();
  const code = query.get('code');
  const { processAuthCallback, isLoading, error } = useAuthCallback();
  
  useEffect(() => {
    if (code && provider && !isLoading) {
      processAuthCallback({ code, provider });
    }
  }, [code, provider, processAuthCallback, isLoading]);
  
  if (!code || !provider) {
    return <Navigate to="/login" replace />;
  }
  
  if (error) {
    return (
      <div className="auth-error">
        <h2>Authentication Failed</h2>
        <p>{error instanceof Error ? error.message : 'Unknown error occurred'}</p>
        <button onClick={() => window.location.href = '/login'}>
          Return to Login
        </button>
      </div>
    );
  }
  
  return (
    <div className="auth-loading">
      <h2>Completing Authentication</h2>
      <div className="spinner"></div>
      <p>Please wait while we authenticate your account...</p>
    </div>
  );
};

export default AuthCallbackPage;