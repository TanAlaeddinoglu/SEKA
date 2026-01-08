import { httpClient } from "../../../shared/api/httpClient";

export const ProductFeatureAPI = {
    update: async (id, payload) => {
        const res = await httpClient.patch(
            `/v1/product-feature/${id}`,
            payload
        );
        return res.data;
    },

        create: async (payload) => {
            const res = await httpClient.post(
                "/v1/product-feature/",
                payload
            );
            return res.data;
        }

};
