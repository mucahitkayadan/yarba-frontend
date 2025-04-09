import api from './api';
import { Profile } from '../types/models';

// Get user's profile (will auto-create if it doesn't exist)
export const getUserProfile = async (): Promise<Profile> => {
  const response = await api.get('/profiles/me');
  return response.data;
};

// Create a new profile
export const createProfile = async (profileData: Partial<Profile>): Promise<Profile> => {
  const response = await api.post('/profiles', profileData);
  return response.data;
};

// Update profile
export const updateProfile = async (profileData: Partial<Profile>): Promise<Profile> => {
  const response = await api.patch('/profiles/me', profileData);
  return response.data;
};

// Update personal information
export const updatePersonalInformation = async (personalInfo: Profile['personal_information']): Promise<Profile> => {
  const response = await api.patch('/profiles/me/personal-information', personalInfo);
  return response.data;
};

// Update preferences
export const updatePreferences = async (preferences: Partial<NonNullable<Profile['preferences']>>): Promise<Profile> => {
  const response = await api.patch('/profiles/me/preferences', preferences);
  return response.data;
};

// Update life story
export const updateLifeStory = async (lifeStory: string): Promise<Profile> => {
  const response = await api.patch('/profiles/me/life-story', { life_story: lifeStory });
  return response.data;
}; 