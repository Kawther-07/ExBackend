const nodemailer = require('nodemailer');
const forgotPasswordModel = require('../models/forgotPassword');
// const { Patient } = require('../models/patient');
const bcrypt = require('bcrypt');
const PatientServices = require('../services/patient.service');
const AuthServices = require('../services/auth.service');

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
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Call the resetPatientPassword method from the PatientServices class
        const result = await PatientServices.resetPatientPassword(email, hashedPassword);

        // If the reset is successful, retrieve the patient's ID by email
        const patient = await PatientServices.getPatientByEmail(email);
        if (!patient) {
            throw new Error("Patient not found after resetting password");
        }

        // Send response with patient's ID and success message
        res.status(200).json({ success: true, message: "Password reset successful", id: patient.id });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ success: false, message: "Error resetting password. Please try again later." });
    }
}

// Reset Password for Admin and Doctors
async function resetPasswordAdminAndDoctors(req, res) {
    const { email, newPassword } = req.body;

    try {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Call the resetAdminDoctorsPassword method from the AuthServices class
        await AuthServices.resetAdminDoctorsPassword(email, hashedPassword);

        // Send success response
        res.status(200).json({ success: true, message: "Password reset successfully"});
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ success: false, message: `Error resetting password. ${error}` });
    }
}


module.exports = {
    forgotPassword,
    verifyCode,
    resetPassword,
    resetPasswordAdminAndDoctors
};
