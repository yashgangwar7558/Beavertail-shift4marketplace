const axios = require('axios');
const CryptoJS = require('crypto-js');

function generateSignature(clientId, clientSecret, method, path, body, timestamp) {
    const requestMethod = method.toUpperCase();
    const requestPath = path.toLowerCase();
    const requestData = body ? JSON.stringify(body) : '';
    const stringToSign = `${clientId}${requestMethod}${requestPath}${requestData}${timestamp}`;

    // Generate HMAC-SHA256 signature
    const hmac = CryptoJS.HmacSHA256(stringToSign, clientSecret);
    //const signature = hmac.toString(CryptoJS.enc.Hex);
    const signature = CryptoJS.enc.Hex.stringify(hmac);

    return signature;
}

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