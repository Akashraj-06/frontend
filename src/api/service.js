// Service API endpoints

/**
 * Returns the list of service categories available on Fixly.
 *
 * NOTE: The backend does not currently expose a public GET /categories endpoint.
 * This static list exactly mirrors the seeded data in data.sql (service_categories table).
 * If a backend endpoint is added in the future, replace the return statement with:
 *   const response = await api.get('/categories');
 *   return response.data;
 *
 * @returns {Promise<Array<{id: number, name: string}>>}
 */
export const getCategories = async () => {
  return [
    { id: 1, name: 'Electrical' },
    { id: 2, name: 'Plumbing' },
    { id: 3, name: 'Painting' },
    { id: 4, name: 'Carpentry' },
    { id: 5, name: 'Appliance Repair' },
    { id: 6, name: 'Home Maintenance' },
  ];
};
