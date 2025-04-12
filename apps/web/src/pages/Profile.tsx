import React from 'react';
import { useUser, useLogout } from '../hooks/useAuth';
import api from '../lib/api';
import {  useQuery } from '@tanstack/react-query';

const ProfilePage: React.FC = () => {
  const { user, isLoading: isUserLoading } = useUser();
  const { logout, isLoading: isLogoutLoading } = useLogout();
  
  // Example of loading additional user data with React Query
  const { data: userDetails, isLoading: isDetailsLoading } = useQuery({
    queryKey: ['userDetails', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user ID');
      const response = await api.get(`/users/${user.id}/details`);
      return response.data;
    },
    enabled: !!user?.id
  });

  
  if (isUserLoading || isDetailsLoading) {
    return <div className="loading">Loading profile...</div>;
  }
  
  if (!user) {
    return <div>No user data available</div>;
  }
  
  return (
    <div className="profile-container">
      <div className="profile-header">
        {user.profileImage && (
          <img 
            src={user.profileImage} 
            alt="Profile" 
            className="profile-avatar" 
          />
        )}
        
        <div className="profile-info">
          <h1>{user.name || 'Anonymous User'}</h1>
          <p>{user.email || 'No email provided'}</p>
        </div>
        
        <button 
          className="btn btn-logout" 
          onClick={() => logout()}
          disabled={isLogoutLoading}
        >
          {isLogoutLoading ? 'Logging out...' : 'Sign Out'}
        </button>
      </div>
      
      <div className="profile-details">
        {/* Display additional user details */}
        {userDetails && (
          <>
            <h2>Account Details</h2>
            <div className="detail-item">
              <span>Member Since:</span>
              <span>{new Date(userDetails.createdAt).toLocaleDateString()}</span>
            </div>
            {/* Additional user information */}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;