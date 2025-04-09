import axios from 'axios';

// In development, the API calls will be proxied through Vite's proxy
// In production, use the Railway URL
const baseURL = import.meta.env.PROD
    ? 'https://yourchorecom-production.up.railway.app'
    : 'http://localhost:5000';

export const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getServices = async () => {
    const response = await api.get('/api/services');
    return response.data;
};

export const getVendors = async () => {
    const response = await api.get('/api/vendors');
    return response.data;
};

export const createOrder = async (orderData: any) => {
    const response = await api.post('/api/orders', orderData);
    return response.data;
};