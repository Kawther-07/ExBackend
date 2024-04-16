const nodemailer = require('nodemailer');
const forgotPasswordModel = require('../models/forgotPassword');
// const { Patient } = require('../models/patient');
const bcrypt = require('bcrypt');
const PatientServices = require('../services/patient.service');

// Create a transporter object with SMTP server settings from environment variables
// Create a transporter object with SMTP server settings from environment variables
const transporter = nodemailer.createTransport({
    service: 'gmail', // Example: Gmail
    auth: {
        user: 'doolabcare@gmail.com', // Your email address for the email service
        pass: 'jyuq lxnm pqvs lary' // Your email password or application-specific password
    }
});

async function forgotPassword(req, res) {
    const { email } = req.body;

    try {
        // Generate a random 4-digit code
        const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

        try {
            // Store the verification code in the database
            await forgotPasswordModel.storeVerificationCode(email, verificationCode);

            // Send email to user using the configured transporter
            await transporter.sendMail({
                from: 'doolabcare@gmail.com', // Sender's email address
                to: email,
                subject: 'Password Reset Code',
                text: `Your verification code is: ${verificationCode}`,
            });

            res.status(200).send('Verification code sent to email');
        } catch (error) {
            console.error('Error sending verification code:', error);
            res.status(500).send('Error sending verification code. Please try again later.');
        }
    } catch (error) {
        console.error('Error generating verification code:', error);
        res.status(500).send('Error generating verification code. Please try again later.');
    }
}


async function verifyCode(req, res) {
    const { email, code } = req.body;

    try {
        // Get the latest verification code from the database
        const storedCode = await forgotPasswordModel.getLatestVerificationCode(email);

        // Check if the provided code matches the latest code
        if (storedCode === code) {
            res.status(200).send('Code verified');
        } else {
            res.status(400).send('Invalid verification code');
        }
    } catch (error) {
        console.error('Error verifying code:', error);
        res.status(500).send('Internal server error');
    }
}




async function resetPassword(req, res) {
    const { email, newPassword } = req.body;

    try {
        // Hash the new password
        const hashedPassword = bcrypt.hashSync(newPassword, 10);

        // Call the resetPatientPassword method from the PatientServices class
        const result = await PatientServices.resetPatientPassword(email, hashedPassword);

        // Send response with patient's ID and email
        res.status(200).json(result); // Send patient's ID and email in the response
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).send('Error resetting password. Please try again later.');
    }
}

module.exports = {
    forgotPassword,
    verifyCode,
    resetPassword
};
