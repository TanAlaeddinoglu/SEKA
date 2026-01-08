import { httpClient } from "../../../shared/api/httpClient";

export const ProductImagesAPI = {
    getAll: async (productId) => {
        const res = await httpClient.get(
            `/v1/products/${productId}/images`
        );
        return res.data;
    },

    upload: async (productId, files) => {
        const formData = new FormData();
        files.forEach((file) =>
            formData.append("files", file)
        );

        const res = await httpClient.post(
            `/v1/products/${productId}/images`,
            formData
        );
        return res.data;
    },

    delete: async (productId, imageId) => {
        await httpClient.delete(
            `/v1/products/${productId}/images/${imageId}`
        );
    },

    setCover: async (productId, imageId) => {
        await httpClient.post(
            `/v1/products/${productId}/images/${imageId}/cover`
        );
    },
};
