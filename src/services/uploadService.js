import api from '../api/axios';

/**
 * Uploads an image file to the backend Cloudinary endpoint
 * @param {File} file - The selected image file
 * @returns {Promise<{url: string}>} - Response containing the secure URL
 */
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/uploads', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};
