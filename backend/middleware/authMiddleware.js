const jwt = require("jsonwebtoken");
const { auth } = require("../config/firebase");
const User = require("../models/User");

// Protected routes can receive either the app JWT or a Firebase ID token.
// This keeps existing frontend social-login storage working without route changes.
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      ...decoded,
      account_type: decoded.account_type || decoded.role,
    };
    return next();
  } catch {
    // If it is not our app JWT, fall back to Firebase Admin token verification.
  }

  try {
    const decodedFirebaseToken = await auth.verifyIdToken(token);

    if (!decodedFirebaseToken.email) {
      return res.status(401).json({ message: "Firebase token has no email" });
    }

    const user = await User.findOne({
      where: { email: decodedFirebaseToken.email },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found for Firebase token" });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.account_type,
      account_type: user.account_type,
      firebaseUid: decodedFirebaseToken.uid,
    };

    return next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

const requireRole = (role) => (req, res, next) => {
  if (req.user?.account_type !== role) {
    return res.status(403).json({ message: "Forbidden" });
  }

  return next();
};

module.exports = { verifyToken, requireRole };
