import axios from 'axios';

// Determine the base URL based on environment
const getBaseUrl = () => {
    if (process.env.NODE_ENV === 'production') {
        // Always use the Railway production URL in production
        return 'https://yourchorecom-production.up.railway.app';
    }

    // In development, use relative URLs to the dev server
    return '';
};

// Create a base API instance with proper configuration
export const api = axios.create({
    baseURL: getBaseUrl(),
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
        if (error.response) {
            // The request was made and the server responded with a non-2xx status
            console.error('API Error Response:', {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            });
        } else if (error.request) {
            // The request was made but no response was received
            console.error('API Error: No response received', error.request);
            // Check if this might be a CORS error
            if (error.message && error.message.includes('Network Error')) {
                console.error('This may be a CORS issue - check that the server allows requests from this origin');
            }
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('API Error Setup:', error.message);
        }
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