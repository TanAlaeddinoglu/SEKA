import { httpClient } from "../../../shared/api/httpClient";

export const loginRequest = async ({ username, password }) => {
    const response = await httpClient.post("/v1/auth/generateToken", {
        username,
        password,
    });
    return response.data; // JWT string
};
