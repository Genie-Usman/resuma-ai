export const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const API_PATHS = {
    AUTH: {
        REGISTER: '/api/auth/register',
        LOGIN: '/api/auth/login',
        GET_PROFILE: '/api/auth/profile',
    },

    RESUME: {
        CREATE: '/api/resume',
        GET_ALL: '/api/resume',
        GET_BY_ID: (id) => `/api/resume/${id}`,
        UPDATE: (id) => `/api/resume/${id}`,
        DELETE: (id) => `/api/resume/${id}`,
        DUPLICATE: (id) => `/api/resume/${id}/duplicate`,
        UPLOAD_IMAGES: (id) => `/api/resume/${id}/upload-images`,
    },

    IMAGE: {
        UPLOAD_IMAGE: '/api/auth/upload-image',
    },

    GEMINI: {
        GENERATE_ITEM_SUMMARY: "/api/gemini/generate-item-summary",
        JOB_MATCH: "/api/gemini/job-match",
        IMPROVE_BULLET: "/api/gemini/improve-bullet-point",
    },
};