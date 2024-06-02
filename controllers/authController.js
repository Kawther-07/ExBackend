const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const AuthServices = require("../services/auth.service");

// Login Admin and Doctor (Dashboard)
exports.loginAdminAndDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: false, message: "Invalid parameters" });
    }

    // Retrieve Admin Or Doctor
    let user = await AuthServices.checkAdminAndDoctor(email);
    if (!user) {
      return res.status(404).json({ status: false, message: "User does not exist" });
    }
    if (user.role === "doctor" && user.isDisabled) {
      return res.status(401).json({ status: false, message: "Your account is disabled until it's enabled by an Admin" });
    }

    // Compare passwords
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ status: false, message: "Invalid password" });
    }

    // Generate JWT token
    const tokenData = {
      id: user.id,
      email: user.email,
      role: user.role,
      // ...(user.role === "admin" ? { admin: user.toJSON() } : { doctor: user.toJSON() }),
    };
    const token = await AuthServices.generateAccessToken(tokenData, process.env.JWTSecret_Key, process.env.JWT_EXPIRE);

    res.status(200).json({
      status: true,
      success: "Successfully logged in",
      role: user.role,
      token,
      ...(user.role === "admin" ? { admin: user } : { doctor: user }),
    });
  } catch (error) {
    console.error("Error logging in doctor:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

exports.verifyUserToken = async (req, res, next) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ status: false, message: "Access Denied" });
  try {
    const verified = jwt.verify(token, process.env.JWTSecret_Key);
    return res.status(200).json({ status: true, message: "Retrieved user data", data: verified });
  } catch (error) {
    res.status(401).json({ status: false, message: "Invalid Token or session expired" });
  }
};
