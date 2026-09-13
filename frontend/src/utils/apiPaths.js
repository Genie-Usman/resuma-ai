export const BASE_URL = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/+$/, "");

export const API_PATHS = {
    PING: '/api/ping',

    AUTH: {
        REGISTER: '/api/auth/register',
        LOGIN: '/api/auth/login',
        LOGOUT: '/api/auth/logout',
        GET_PROFILE: '/api/auth/profile',
        GOOGLE_AUTH: '/api/auth/google',
        LINKEDIN_AUTH: '/api/auth/linkedin',
    },

    RESUME: {
        CREATE: '/api/resume',
        GET_ALL: '/api/resume',
        GET_BY_ID: (id) => `/api/resume/${id}`,
        UPDATE: (id) => `/api/resume/${id}`,
        DELETE: (id) => `/api/resume/${id}`,
        DUPLICATE: (id) => `/api/resume/${id}/duplicate`,
        UPLOAD_IMAGES: (id) => `/api/resume/${id}/upload-images`,
        EXPORT_PDF: (id) => `/api/resume/${id}/export-pdf`,
        EXPORT_PUBLIC_PDF: (slug) => `/api/resume/public/${slug}/export-pdf`,
    },

    IMAGE: {
        UPLOAD_IMAGE: '/api/auth/upload-image',
    },

    GEMINI: {
        GENERATE_ITEM_SUMMARY: "/api/gemini/generate-item-summary",
        JOB_MATCH: "/api/gemini/job-match",
        IMPROVE_BULLET: "/api/gemini/improve-bullet-point",
        RESUME_AUDIT: "/api/gemini/resume-audit",
    },
};