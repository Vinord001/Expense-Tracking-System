import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Ensure Authorization header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized. Token missing." });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Not authorized. Token missing." });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("JWT Verification Error:", err.message);
      return res.status(401).json({ message: "Not authorized. Invalid token." });
    }

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Not authorized. Invalid token payload." });
    }

    // Get the user from DB
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    // Attach user to request for use in controllers
    req.user = user;

    next();

  } catch (err) {
    console.error("Auth Middleware Error:", err.message);
    return res.status(500).json({ message: "Authentication error." });
  }
};

export default authMiddleware;
