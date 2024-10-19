const axios = require('axios');

// Create Axios instance with interceptors
const axiosInstance = axios.create();

// Add request interceptor to include headers in all requests
axiosInstance.interceptors.request.use((config) => {
    const timestamp = Math.floor(Date.now() / 1000); 
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const method = config.method.toUpperCase();
    const url = new URL(config.url);
    const path = url.pathname.toLowerCase();
    const body = config.data || '';

    const signature = generateSignature(clientId, clientSecret, method, path, body, timestamp);

    // Set custom headers
    config.headers['x-access-key'] = clientId;
    config.headers['x-timestamp'] = timestamp;
    config.headers['x-signature'] = signature;

    return config;
}, (error) => {
    return Promise.reject(error);
});

module.exports = axiosInstance