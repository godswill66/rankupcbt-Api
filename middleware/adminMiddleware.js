const jwt = require("jsonwebtoken");
const User = require("../models/user");

const adminMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    // Verify token using your secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user and check role
    const user = await User.findById(decoded.id);

    // Check if user exists and is an admin
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = adminMiddleware;
