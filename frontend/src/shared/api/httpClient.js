import axios from "axios";
import toast from "react-hot-toast";
import { parseApiError } from "../utils/errorParser";

const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    "";

export const httpClient = axios.create({
    baseURL: apiBaseUrl,
});

httpClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

httpClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = parseApiError(error);
        toast.error(message);
        return Promise.reject(error);
    }
);
