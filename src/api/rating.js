import api from './axios';

export const submitRating = async (serviceRequestId, rating) => {
    const response = await api.post('/worker-ratings', {
        serviceRequestId,
        rating
    });
    return response.data;
};
