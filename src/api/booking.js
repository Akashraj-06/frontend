import api from './axios';

/**
 * Creates a new service request (booking)
 * @param {Object} data 
 * @param {number} data.workerId
 * @param {string} [data.description]
 * @param {string} [data.photoUrl]
 * @param {number} data.latitude
 * @param {number} data.longitude
 * @param {string} [data.address]
 * @returns {Promise<Object>} Resolves with the created ServiceRequest
 */
export const createServiceRequest = async (data) => {
  const response = await api.post('/service-request', data);
  return response.data;
};

/**
 * Fetches all service requests for the logged-in customer
 * @returns {Promise<Array>} Resolves to a list of service requests
 */
export const getMyBookings = async () => {
  const response = await api.get('/service-request');
  return response.data;
};
