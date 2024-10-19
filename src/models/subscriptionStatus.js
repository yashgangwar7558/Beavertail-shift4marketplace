const mongoose = require('mongoose');

const subscriptionStatusSchema = new mongoose.Schema({
    subscriptionId: Number,
    locationId: Number,
    guid: String,
    tenantId: String, 
    status: String,
    details: Object
});

module.exports = mongoose.model('SubscriptionStatus', subscriptionStatusSchema);
