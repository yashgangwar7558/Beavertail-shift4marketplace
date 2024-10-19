const mongoose = require('mongoose');

const customerDataSchema = new mongoose.Schema({
    guid: String,
    state: String,
    createdAt: String,
    location: {
        id: Number,
        name: String,
        timeZone: String,
        merchantId: String,
        countryCode: String,
        currency: String,
        brandRef: String
    },
    restaurant: {
        name: String,
        email: String,
        addressLine1: String,
        addressLine2: String,
        city: String,
        state: String,
        zip: String,
        hasIntegrationBusinessAccount: Boolean,
        externalId: String
    },
    contact: {
        firstName: String,
        lastName: String,
        email: String,
        phone: String
    },
    salesRepContact: {
        firstName: String,
        lastName: String,
        phone: String,
        phoneExt: String,
        email: String
    },
    dealerContact: {
        company: String,
        firstName: String,
        lastName: String,
        phone: String,
        phoneExt: String,
        email: String
    }
});

module.exports = mongoose.model('CustomerData', customerDataSchema);
