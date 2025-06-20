const express = require('express');
const router = express.Router();
const { sendSMS } = require('../controllers/sms.controller');

router.post('/send', sendSMS);

module.exports = router;
