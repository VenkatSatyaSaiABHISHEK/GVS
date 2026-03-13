import axiosInstance from '@/lib/axiosInstance';

/**
 * Get profile completion status
 */
export const getProfileStatus = async () => {
  try {
    const response = await axiosInstance.get('/profile/status');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get user profile data
 */
export const getProfile = async () => {
  try {
    const response = await axiosInstance.get('/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get required fields for user's role
 */
export const getRequiredFields = async () => {
  try {
    const response = await axiosInstance.get('/profile/required-fields');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getProfileStrength = async () => {
  try {
    const response = await axiosInstance.get('/profile/strength');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Complete profile (first time)
 */
export const completeProfile = async (profileData) => {
  try {
    const response = await axiosInstance.put('/profile/complete', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update profile (anytime)
 */
export const updateProfile = async (profileData) => {
  try {
    const response = await axiosInstance.put('/profile/update', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Upload profile picture
 */
export const uploadProfilePicture = async (file) => {
  try {
    const formData = new FormData();
    formData.append('profilePic', file);
    
    const response = await axiosInstance.put('/user/profile-pic', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
