import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Authentication API
export const authAPI = {
    signup: async (userData) => {
        const response = await api.post('/api/auth/signup', userData);
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/api/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('auth_token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    getToken: () => {
        return localStorage.getItem('auth_token');
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('auth_token');
    }
};

// Data API
export const dataAPI = {
    uploadFile: async (file, onUploadProgress) => {
        const formData = new FormData();
        formData.append('dataset', file);

        const response = await api.post('/api/data/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (onUploadProgress) {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    onUploadProgress(percentCompleted);
                }
            },
        });
        return response.data;
    },

    getHistory: async (page = 1, limit = 20) => {
        const response = await api.get(`/api/data/history?page=${page}&limit=${limit}`);
        return response.data;
    },

    getReport: async (reportId) => {
        const response = await api.get(`/api/data/reports/${reportId}`);
        return response.data;
    }
};

// Health check
export const healthAPI = {
    check: async () => {
        const response = await api.get('/health');
        return response.data;
    }
};

export default api;