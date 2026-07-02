import api from './axios';

/**
 * Sends login credentials to the backend.
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise} Resolves with { token, userId, name, email, role }
 */
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

/**
 * Sends registration data to the backend.
 * @param {{ name: string, email: string, password: string, phone: string, role: string, categoryId?: number, latitude?: number, longitude?: number }} data
 * @returns {Promise} Resolves with the backend response
 */
export const register = async (data) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};
