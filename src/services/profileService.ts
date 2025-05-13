import api from './api';
import { Profile } from '../types/models';

// Define a type specifically for the Personal Information response
export type PersonalInformation = Profile['personal_information'];

// Get user's profile (will auto-create if it doesn't exist)
export const getUserProfile = async (): Promise<Profile> => {
  const response = await api.get('/profiles/me');
  return response.data;
};

// Get user's personal information
export const getPersonalInformation = async (): Promise<PersonalInformation> => {
  const response = await api.get('/profiles/me/personal-information');
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

// // Update preferences (Old function - commented out)
// export const updatePreferences = async (preferences: Partial<NonNullable<Profile['preferences']>>): Promise<Profile> => {
//   const response = await api.patch('/profiles/me/preferences', preferences);
//   return response.data;
// };

// Update prompt preferences
export const updatePromptPreferences = async (promptPrefs: Partial<NonNullable<Profile['prompt_preferences']>>): Promise<Profile> => {
  const response = await api.put('/profiles/me/preferences/prompt', promptPrefs);
  return response.data;
};

// Update system preferences
export const updateSystemPreferences = async (systemPrefs: Partial<NonNullable<Profile['system_preferences']>>): Promise<Profile> => {
  const response = await api.put('/profiles/me/preferences/system', systemPrefs);
  return response.data;
};

// Update life story
export const updateLifeStory = async (lifeStory: string): Promise<Profile> => {
  const response = await api.patch('/profiles/me/life-story', { life_story: lifeStory });
  return response.data;
};

// Profile Picture Operations
export const uploadProfilePicture = async (file: File): Promise<{ profile_picture_key: string }> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/profiles/me/profile-picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getProfilePictureUrl = async (): Promise<{ profile_picture_key: string }> => {
  const response = await api.get('/profiles/me/profile-picture');
  return response.data;
};

export const deleteProfilePicture = async (): Promise<{ profile_picture_key: null }> => {
  const response = await api.delete('/profiles/me/profile-picture');
  return response.data;
};

// Signature Operations
export const uploadSignature = async (file: File): Promise<{ signature_key: string }> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/profiles/me/signature', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getSignatureUrl = async (): Promise<{ signature_key: string }> => {
  const response = await api.get('/profiles/me/signature');
  return response.data;
};

export const deleteSignature = async (): Promise<{ signature_key: null }> => {
  const response = await api.delete('/profiles/me/signature');
  return response.data;
}; 