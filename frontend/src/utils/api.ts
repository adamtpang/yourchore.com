import axios from 'axios';

// Always use the Railway URL in production, local proxy in development
const baseURL = import.meta.env.PROD
    ? 'https://yourchorecom-production.up.railway.app'
    : 'http://localhost:5000';

// Add retry logic and better error handling
export const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    // Add timeout
    timeout: 10000,
});

// Add response interceptor for better error handling
api.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data,
        });
        return Promise.reject(error);
    }
);

export const getServices = async () => {
    try {
        const response = await api.get('/api/services');
        return response.data;
    } catch (error) {
        console.error('Error fetching services:', error);
        throw error;
    }
};

export const getVendors = async (serviceId?: string) => {
    try {
        const url = serviceId ? `/api/vendors?serviceId=${serviceId}` : '/api/vendors';
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching vendors:', error);
        throw error;
    }
};

export const createOrder = async (orderData: any) => {
    try {
        const response = await api.post('/api/orders', orderData);
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};