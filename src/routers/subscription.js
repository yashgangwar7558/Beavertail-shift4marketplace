const express = require('express')
const router = express.Router()

const {
    getAllStatus,
    deleteSubscriptonStatus,
    receivedInstallationRequest,
    receivedCancelRequest,
    receivedUninstallRequest,
    confirmUninstallation,
    confirmInstallation
} = require('../controllers/subscription')

const {
    authenticateIncomingRequest,
} = require('../middlewares/auth')

router.post('/app/s4/install', authenticateIncomingRequest, receivedInstallationRequest)
router.post('/app/s4/cancel', authenticateIncomingRequest, receivedCancelRequest)
router.post('/app/s4/uninstall', authenticateIncomingRequest, receivedUninstallRequest)

router.post('/app/s4/getAllStatus', getAllStatus)
router.post('/app/s4/deleteSubscriptionStatus', deleteSubscriptonStatus)
    
// router.post('/app/s4/install', receivedInstallationRequest)
// router.post('/app/s4/cancel', receivedCancelRequest)
// router.post('/app/s4/uninstall', receivedUninstallRequest)

router.post('/app/s4/confirm/install', confirmInstallation)
router.post('/app/s4/confirm/uninstall', confirmUninstallation)

module.exports = router