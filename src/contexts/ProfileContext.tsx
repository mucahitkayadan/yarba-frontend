import React, { createContext, useState, useContext, useEffect } from 'react';
import { getUserProfile } from '../services/profileService';
import { Profile } from '../types/models';
import { useAuth } from './AuthContext';

interface ProfileContextType {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<Profile | null>;
}

const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  loading: false,
  error: null,
  refreshProfile: async () => null,
});

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchProfile = async (): Promise<Profile | null> => {
    if (!user) {
      setLoading(false);
      return null;
    }
    
    try {
      setLoading(true);
      setError(null);
      const data = await getUserProfile();
      setProfile(data);
      return data;
    } catch (err: any) {
      console.error('Failed to fetch profile:', err);
      setError(err.message || 'Failed to load profile data');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch when the context is mounted
  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const refreshProfile = async (): Promise<Profile | null> => {
    return await fetchProfile();
  };

  return (
    <ProfileContext.Provider value={{ profile, loading, error, refreshProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileContext; 