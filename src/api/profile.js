import api from './axios';

/**
 * Retrieves the currently authenticated user's profile.
 * @returns {Promise} Resolves with the user profile DTO
 */
export const getProfile = async () => {
  const response = await api.get('/profile');
  return response.data;
};

/**
 * Updates the user's profile details.
 * @param {{ name: string, phone?: string, address?: string, profileImageUrl?: string }} data
 * @returns {Promise} Resolves with the updated user profile DTO
 */
export const updateProfile = async (data) => {
  const response = await api.put('/profile', data);
  return response.data;
};
export default { getProfile, updateProfile };
