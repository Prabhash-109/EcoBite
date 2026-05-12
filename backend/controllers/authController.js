

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const { verifyFirebaseLogin } = require("../config/firebase");
const { sendWelcomeEmail } = require("../config/mailer");
const sendAuthResponse = (
  res,
  user,
  message,
  statusCode = 200
) => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.account_type,
      account_type: user.account_type
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return res.status(statusCode).json({
    message,
    token,
    id: user.id,
    role: user.account_type,
    account_type: user.account_type,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber
  });
};

// ==========================================
// Register User
// ==========================================
exports.registerUser = async (req, res) => {
  try {
    const {
      account_type,
      name,
      email,
      password,
      phoneNumber
    } = req.body;

    // Check existing user
    const existingUser = await User.findOne({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      account_type,
      name,
      email,
      password: hashedPassword,
      phoneNumber
    });

    // Send welcome email (non-blocking)
    try {
      sendWelcomeEmail(email, name, account_type);
    } catch (err) {
      console.log("Email error:", err.message);
    }

    return sendAuthResponse(
      res,
      newUser,
      "Registration successful",
      201
    );

  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};

// ==========================================
// Login User
// ==========================================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    // Firebase users cannot use password login
    if (!user.password) {
      return res.status(400).json({
        message: "Please sign in with Google or GitHub"
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    return sendAuthResponse(
      res,
      user,
      "Login successful"
    );

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};

// ==========================================
// Firebase Sign In
// ==========================================
exports.firebaseSignIn = async (req, res) => {
  try {
    const { idToken, account_type } = req.body;

    // Verify Firebase token
    const firebaseUser = await verifyFirebaseLogin(idToken);

    // Find user
    let user = await User.findOne({
      where: { email: firebaseUser.email }
    });

    if (!user) {
      user = await User.create({
        name:
          firebaseUser.name ||
          firebaseUser.email.split("@")[0],
        email: firebaseUser.email,
        account_type: account_type || "volunteer",
        phoneNumber: null,
        password: null
      });

      // Welcome email (non-blocking)
      sendWelcomeEmail(
        user.email,
        user.name,
        user.account_type
      );
    }

    // Update name if changed
    const updateData = {};

    if (
      firebaseUser.name &&
      user.name !== firebaseUser.name
    ) {
      updateData.name = firebaseUser.name;
    }

    if (
      account_type &&
      user.account_type !== account_type
    ) {
      updateData.account_type = account_type;
    }

    if (Object.keys(updateData).length > 0) {
      await user.update(updateData);

      user = await User.findByPk(user.id);
    }

    return sendAuthResponse(
      res,
      user,
      "Sign in successful"
    );

  } catch (error) {
    console.error("Firebase sign-in error:", error);

    return res.status(401).json({
      message: "Invalid Firebase token"
    });
  }
};

// ==========================================
// Firebase Sign Up
// ==========================================
exports.firebaseSignUp = async (req, res) => {
  try {
    const {
      idToken,
      account_type
    } = req.body;

    // Verify Firebase token
    const firebaseUser = await verifyFirebaseLogin(
      idToken
    );

    // Check existing user
    const existingUser = await User.findOne({
      where: { email: firebaseUser.email }
    });

    if (existingUser) {
      return res.status(400).json({
        message:
          "Email already registered. Please sign in instead."
      });
    }

    // Create user
    const newUser = await User.create({
      name:
        firebaseUser.name ||
        firebaseUser.email.split("@")[0],

      email: firebaseUser.email,

      account_type: account_type || "volunteer",

      phoneNumber: null,

      // Firebase users do not need password
      password: null
    });

    // Welcome email
    try {
      sendWelcomeEmail(
        newUser.email,
        newUser.name,
        newUser.account_type
      );
    } catch (err) {
      console.log("Email error:", err.message);
    }

    return sendAuthResponse(
      res,
      newUser,
      "Account created successfully",
      201
    );

  } catch (error) {
    console.error("Firebase sign-up error:", error);

    return res.status(500).json({
      message: "Account creation failed"
    });
  }
};
