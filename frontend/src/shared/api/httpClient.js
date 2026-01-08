import axios from "axios";
import toast from "react-hot-toast";
import { parseApiError } from "../utils/errorParser";

export const httpClient = axios.create({
    baseURL: "http://localhost:8080",
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
        console.log("🔥 INTERCEPTOR ERROR:", error.response?.data);
        const message = parseApiError(error);
        toast.error("TEST TOAST");

        toast.error(message);
        return Promise.reject(error);
    }
);
