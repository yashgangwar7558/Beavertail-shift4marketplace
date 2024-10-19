require('dotenv').config()
const axiosInstance = require('../axiosConfig')
const axios = require('axios');
const SubscriptionStatus = require('../models/subscriptionStatus'); 
const CustomerData = require('../models/customerData'); 

// ################### Getting #################### //

exports.getAllStatus = async (req, res) => {
    try {
        const subscriptionStatus = await SubscriptionStatus.find({})

        if (subscriptionStatus.length == 0) {
            return res.json({
                success: false,
                message: 'No requests found!',
            });
        }

        res.json({ success: true, subscriptionStatus });
    } catch (err) {
        console.error('Error getting all subscription requests:', err.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}

// ################### Installation ###################### //

exports.receivedInstallationRequest = async (req, res) => {
    try {
        const { subscriptionId } = req.body.event;
        const { guid, locationId } = req.body.payload;

        // Creating new subscription status
        const newSubscriptionStatus = new SubscriptionStatus({
            subscriptionId,
            locationId,
            guid,
            status: 'Install - Requested'
        });
        await newSubscriptionStatus.save()

        // Fetching customer data for that request
        const apiUrl = `${process.env.SHIFT_HOST}/marketplace/v2/locations/${locationId}/requests/installations/${guid}`;
        const apiResponse = await axiosInstance.get(apiUrl);

        // const apiUrl = `http://localhost:8086/marketplace/v2/locations/${locationId}/requests/installations/${guid}`;
        // const apiResponse = await await axios.get(apiUrl)

        // Storing customer data fetched 
        const customerData = apiResponse.data;
        customerData.guid = guid
        const newCustomerData = new CustomerData(customerData);
        await newCustomerData.save();

        // Updating subscription status to InProgress
        await SubscriptionStatus.updateOne({ guid, locationId }, { status: 'Install - InProgress' });

        res.status(200).json({ success: true, message: "Installation Request & Customer data received." })
    } catch (err) {
        console.error('Error accepting installation request:', err.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}

exports.confirmInstallation = async (req, res) => {
    try {
        const { guid, locationId } = req.body

        const patchUrl = `${process.env.SHIFT_HOST}/marketplace/v2/locations/${locationId}/requests/installations/${guid}`
        const apiResponse = await axiosInstance.patch(patchUrl, {
            state: 'FULFILLED',
        })

        // const patchUrl = `http://localhost:8086/marketplace/v2/locations/${locationId}/requests/installations/${guid}`
        // const apiResponse = await axios.patch(patchUrl, {
        //     state: 'FULFILLED',
        // })

        await SubscriptionStatus.updateOne({ guid, locationId }, { status: 'Install - Confirmed' });

        res.status(200).json({ success: true, message: "Confirmed - tenant is onboarded!" })
    } catch (err) {
        console.error('Error confirming tenant installation:', err.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}



// ################### Cancellation ###################### //

exports.receivedCancelRequest = async (req, res) => {
    try {
        const { guid, locationId } = req.body.payload;

        // Deleting customer data fetched 
        await CustomerData.deleteOne({ guid })

        // Updating subscription status to Cancelled
        await SubscriptionStatus.updateOne({ guid, locationId }, { status: 'Cancelled' });

        res.status(200).json({ success: true, message: "Cancel Request accepted & Customer data deleted." })
    } catch (err) {
        console.error('Error accepting cancellation request:', err.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}

exports.deleteSubscriptonStatus = async (req, res) => {
    try {
        const { guid, locationId } = req.body;

        await SubscriptionStatus.deleteOne({ guid, locationId });

        res.status(200).json({ success: true, message: "Deleted subscription status!" })
    } catch (err) {
        console.error('Error deleting subscription status:', err.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}

// ################### Uninstallation ###################### //

exports.receivedUninstallRequest = async (req, res) => {
    try {
        const { locationId } = req.body.payload;
        const { subscriptionId } = req.body.event;

        // Updating subscription status to Uninstall
        await SubscriptionStatus.updateOne({ subscriptionId, locationId }, { status: 'Uninstall' });

        res.status(200).json({ success: true, message: "Uninstall request received." })
    } catch (err) {
        console.error('Error receiving uninstallation request:', err.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}

exports.confirmUninstallation = async (req, res) => {
    try {
        const { locationId } = req.body;

        await SubscriptionStatus.updateOne({ locationId }, { status: 'Uninstall - Confirmed' });

        res.status(200).json({success: true, message: 'Confirmed - tenant is deboarded!'})
    } catch (err) {
        console.error('Error confirming tenant uninstallation:', err.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}