const jwt = require("jsonwebtoken");

const Authorize = (allowedRoles) => {
  return (req, res, next) => {
    const authHeader = req.headers["authorization"];
    
    // Check if there is an authorization header
    if (!authHeader) {
      // If no authorization header, continue without authentication
      req.user = null;  // Set req.user to null or whatever is appropriate
      return next();
    }

    const token = authHeader.split(" ")[1]; // Extract the token from Bearer

    if (!token) {
      return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token, "secret", (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized!" });
      }

      req.user = decoded;

      if (!allowedRoles.includes(decoded.role)) {
        return res.status(401).send({ message: "Unauthorized!" });
      }

      next();
    });
  };
};

module.exports = Authorize;
