import { createApiClient } from './apiClient.js';
import { API_BASE_URL, endpoints } from './endpoints.js';

export function buildApi({ getToken, onUnauthorized }) {
  const client = createApiClient({ baseURL: API_BASE_URL, getToken, onUnauthorized });

  return {
    auth: {
      login: async ({ email, password }) => {
        const res = await client.post(endpoints.auth.login, { email, password });
        return res.data;
      }
    },
    propietarios: crud(client, endpoints.propietarios),
    mascotas: crud(client, endpoints.mascotas),
    citas: crud(client, endpoints.citas),
    episodios: crud(client, endpoints.episodios),
    tratamientos: crud(client, endpoints.tratamientos),
    recordatorios: crud(client, endpoints.recordatorios)
  };
}

function crud(client, basePath) {
  return {
    list: async () => (await client.get(basePath)).data,
    get: async (id) => (await client.get(`${basePath}/${id}`)).data,
    create: async (payload) => (await client.post(basePath, payload)).data,
    update: async (id, payload) => (await client.put(`${basePath}/${id}`, payload)).data,
    remove: async (id) => (await client.delete(`${basePath}/${id}`)).data
  };
}
