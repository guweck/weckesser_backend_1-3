const nodemailer = require('nodemailer');
const path = require('path');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

const sendTestEmail = async (req, res) => {
    try {
        const { to, subject, message } = req.body;

        const mailOptions = {
            from: `"Backend Weckesser" <${process.env.GMAIL_USER}>`,
            to,
            subject,
            html: `
                <h2>Mensaje de prueba</h2>
                <p>${message}</p>
                <img src="cid:logoimg" style="width: 150px;" />
            `,
            attachments: [
                {
                    filename: 'logo.png',
                    path: path.join(__dirname, '../public/img/logo.png'),
                    cid: 'logoimg'
                }
            ]
        };

        const info = await transporter.sendMail(mailOptions);
        res.status(200).json({ status: 'success', messageId: info.messageId });
    } catch (error) {
        console.error('Error enviando correo:', error);
        res.status(500).json({ status: 'error', error: error.message });
    }
};

module.exports = { sendTestEmail };
