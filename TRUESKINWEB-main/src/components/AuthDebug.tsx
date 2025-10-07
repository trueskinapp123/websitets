import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthDebug: React.FC = () => {
  const { user, profile, session, loading, signOut } = useAuth();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const handleTestSignOut = async () => {
    console.log('Test sign out clicked');
    try {
      await signOut();
      console.log('Test sign out completed');
    } catch (error) {
      console.error('Test sign out error:', error);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-xs max-w-xs z-50">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <div className="space-y-1">
        <div>Loading: {loading ? 'Yes' : 'No'}</div>
        <div>User: {user ? user.email : 'None'}</div>
        <div>Profile: {profile ? profile.full_name || 'No name' : 'None'}</div>
        <div>Session: {session ? 'Active' : 'None'}</div>
        <div>User ID: {user?.id || 'None'}</div>
        {user && (
          <button
            onClick={handleTestSignOut}
            className="mt-2 px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
          >
            Test Sign Out
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthDebug;
