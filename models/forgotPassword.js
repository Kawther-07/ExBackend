const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcrypt");
// const { Patient } = require('./patient');

// Define the PasswordResetCode model
const PasswordResetCode = sequelize.define(
  "PasswordResetCode",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: "password_reset_codes",
  }
);

// Sync the model with the database
PasswordResetCode.sync()
  .then(() => {
    console.log("PasswordResetCode model synchronized with database");
  })
  .catch((err) => {
    console.error("Error synchronizing PasswordResetCode model:", err);
  });

// Function to store verification code
async function storeVerificationCode(email, code) {
  try {
    await PasswordResetCode.create({ email, code });
    return true; // Indicate success
  } catch (error) {
    console.error("Error storing verification code:", error);
    throw error; // Propagate error to caller
  }
}

// Function to get verification code by email
async function getVerificationCode(email) {
  try {
    const result = await PasswordResetCode.findOne({ where: { email } });
    if (result) {
      return result.code; // Return the verification code
    } else {
      return null; // No code found for the email
    }
  } catch (error) {
    console.error("Error retrieving verification code:", error);
    throw error; // Propagate error to caller
  }
}

async function getLatestVerificationCode(email) {
  try {
    const latestCode = await PasswordResetCode.findOne({
      where: { email },
      order: [["createdAt", "DESC"]], // Order by createdAt in descending order to get the latest code
      attributes: ["code"], // Only retrieve the code attribute
    });
    return latestCode ? latestCode.code : null; // Return the latest code if found, otherwise null
  } catch (error) {
    console.error("Error retrieving latest verification code:", error);
    throw error; // Propagate error to caller
  }
}

async function resetPassword(email, newPassword) {
  try {
    // Find the patient by email
    const patient = await Patient.findOne({ where: { email } });

    // If patient not found, throw an error
    if (!patient) {
      throw new Error("Patient not found");
    }

    // Hash the new password
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    // Update patient's password
    patient.password = hashedPassword;

    // Save the changes
    await patient.save();

    // Return true indicating success
    return true;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error; // Propagate error to caller
  }
}

module.exports = {
  storeVerificationCode,
  getVerificationCode,
  getLatestVerificationCode,
  resetPassword,
};
