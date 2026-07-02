import api from './axios';

/**
 * Gets all jobs assigned to the logged-in worker
 * @returns {Promise<Array>} List of worker jobs (pending requests & assignments)
 */
export const getWorkerJobs = async () => {
  const response = await api.get('/jobs/worker');
  return response.data;
};

/**
 * Accepts a targeted service request
 * @param {number} serviceRequestId 
 * @returns {Promise<Object>} The created JobAssignment
 */
export const acceptJob = async (serviceRequestId) => {
  const response = await api.post(`/jobs/accept/${serviceRequestId}`);
  return response.data;
};

/**
 * Marks an assigned job as completed
 * @param {number} jobAssignmentId 
 * @returns {Promise<Object>} The updated JobAssignment
 */
export const completeJob = async (jobAssignmentId) => {
  const response = await api.post(`/jobs/complete/${jobAssignmentId}`);
  return response.data;
};
