const CryptoJS = require('crypto-js');
require('dotenv').config()

exports.authenticateIncomingRequest = (req, res, next) => {
    const timestamp = req.headers['x-timestamp']
    const signature = req.headers['x-signature']
    const accessKey = req.headers['x-access-key']

    if (!timestamp || !signature || !accessKey) {
        return res.status(400).send('Missing headers')
    }

    const requestPath = req.path;
    const requestMethod = req.method;
    const requestData = JSON.stringify(req.body)
    const combinedString = `${process.env.CLIENT_ID}${requestMethod}${requestPath}${requestData}${timestamp}`

    const hmac = CryptoJS.HmacSHA256(combinedString, process.env.CLIENT_SECRET);
    const digest = CryptoJS.enc.Hex.stringify(hmac);

    if (digest !== signature) {
        return res.status(401).send('Invalid signature')
    }

    next()
}

