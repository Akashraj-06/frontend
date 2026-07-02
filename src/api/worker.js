import api from './axios';

/**
 * Fetches nearby workers from the backend.
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} [radius=10.0] - Radius in kilometers
 * @returns {Promise<Array>} Resolves to a list of nearby workers
 */
export const getNearbyWorkers = async (lat, lng, radius = 10.0) => {
  const response = await api.get('/workers/nearby', {
    params: { lat, lng, radius },
  });
  return response.data;
};
