const mongoose = require('mongoose');

const subscriptionStatusSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: new Date(),
    },
    updatedAt: {
        type: Date,
        default: new Date(),
    },
    subscriptionId: Number,
    locationId: Number,
    guid: String,
    tenantId: String,
    status: String,
    details: Object
});

module.exports = mongoose.model('SubscriptionStatus', subscriptionStatusSchema);
