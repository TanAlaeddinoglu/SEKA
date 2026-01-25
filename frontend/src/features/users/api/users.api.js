import { httpClient } from "../../../shared/api/httpClient";

export const UserAPI = {
    getAll: async () => {
        const res = await httpClient.get("/v1/auth");
        return res.data;
    },

    getByUsername: async (username) => {
        const res = await httpClient.get(`/v1/auth/${username}`);
        return res.data;
    },

    create: async (payload) => {
        const res = await httpClient.post("/v1/auth/addNewUser", payload);
        return res.data;
    },

    update: async ({ username, payload }) => {
        const res = await httpClient.patch(
            `/v1/auth/${username}`,
            payload
        );
        return res.data;
    },

    delete: async (username) => {
        const res = await httpClient.delete(
            `/v1/auth/${username}`
        );
        return res.data;
    },
};
