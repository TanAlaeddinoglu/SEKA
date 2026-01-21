import { httpClient } from "../../../shared/api/httpClient";

export const CategoryAPI = {
    getAll: async () => {
        const res = await httpClient.get("/v1/category/");
        return res.data;
    },

    create: async ({ categoryName, isActive }) => {
        const res = await httpClient.post("/v1/category/", {
            categoryName,
            isActive,
        });
        return res.data;
    },

    update: async (id, { categoryName, isActive }) => {
        const res = await httpClient.patch(`/v1/category/${id}`, {
            categoryName,
            isActive,
        });
        return res.data;
    },

    remove: async (id) => {
        await httpClient.delete(`/v1/category/${id}`);
    },
};
