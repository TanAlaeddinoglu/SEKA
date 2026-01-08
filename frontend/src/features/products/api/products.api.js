import { httpClient } from "../../../shared/api/httpClient";

export const ProductAPI = {
    getAll: async (params = {}) => {
        const res = await httpClient.get("/v1/products/", { params });
        return res.data;
    },

    getById: async (id) => {
        const res = await httpClient.get(`/v1/products/${id}`);
        return res.data;
    },
    create: async (payload) => {
        const res = await httpClient.post(
            "/v1/products/",
            payload
        );
        return res.data;
    },

    delete: async (id) => {
        await httpClient.delete(`/v1/products/${id}`);
    },

    update: async (id, payload) => {
        const res = await httpClient.patch(`/v1/products/${id}`, payload);
        return res.data;
    },
};

