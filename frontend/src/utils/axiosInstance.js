import axios from 'axios';
import { BASE_URL } from './apiPaths';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 60000,
    withCredentials: true, // Transmit and receive HttpOnly cookies across requests
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
});

// Request Interceptor (supports dual token delivery: cookie + optional Authorization header)
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('token');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            const currentPath = window.location.pathname;
            const isPublicRoute =
                currentPath === "/" ||
                currentPath.startsWith("/auth") ||
                currentPath.startsWith("/privacy") ||
                currentPath.startsWith("/view") ||
                currentPath.startsWith("/r/") ||
                currentPath.startsWith("/print/public");

            if (error.response.status === 401 && !isPublicRoute) {
                // Redirect unauthorized users on protected pages to login
                window.location.href = "/auth/login";
            } else if (error.response.status === 500) {
                console.error('Server Error. Please try again later.');
            }
        } else if (error.code === 'ECONNABORTED') {
            console.error('Request timeout. Please try again.');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;