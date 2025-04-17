import axios from 'axios';

// Create a base API instance with proper configuration
export const api = axios.create({
    baseURL: process.env.NODE_ENV === 'production'
        ? 'https://yourchorecom-production.up.railway.app'
        : '',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Add request interceptor for debugging
api.interceptors.request.use(
    (config) => {
        console.log(`API Request to ${config.url}:`, config);
        return config;
    },
    (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        console.log(`API Response from ${response.config.url}:`, response);
        return response;
    },
    (error) => {
        console.error('API Error:', error.response || error);
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

export const createCheckoutSession = async (checkoutData: any) => {
    try {
        const response = await api.post('/api/create-checkout-session', checkoutData);
        return response.data;
    } catch (error) {
        console.error('Error creating checkout session:', error);
        throw error;
    }
};