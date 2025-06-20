const twilio = require('twilio');

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const sendSMS = async (req, res) => {
    try {
        const { to, message } = req.body;

        const result = await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to
        });

        res.status(200).json({ status: 'success', sid: result.sid });
    } catch (error) {
        console.error('Error enviando SMS:', error);
        res.status(500).json({ status: 'error', error: error.message });
    }
};

module.exports = { sendSMS };
