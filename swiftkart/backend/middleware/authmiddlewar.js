const jwt = require("jsonwebtoken");
const User = require("../models/usermodel"); // Your user model
const JWT_secret = process.env.JWT_SECRET;

const verifyAdmin = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_secret);
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Not an admin." });
    }

    req.user = user;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(400).json({ error: "Invalid token." });
  }
};

module.exports = { verifyAdmin };
