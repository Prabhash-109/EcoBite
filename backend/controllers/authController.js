const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Sequelize model

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { account_type, name, email, password,phoneNumber } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      account_type,
      name,
      email,
      password: hashedPassword,
      phoneNumber: phoneNumber
    });

    // Send welcome email (non-blocking)
    sendWelcomeEmail(email, name, account_type);

    res.status(201).json({ message: "Registration successful" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Firebase-created users have password: null and cannot use password login.
    if (!user.password) {
      return res.status(400).json({ message: "Please sign in with Google or GitHub" });
    }

    // Compare password only after confirming this user has a local password hash.
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.account_type, account_type: user.account_type },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      id: user.id,
      role: user.account_type,
      account_type: user.account_type,
      name: user.name,
      phoneNumber: user.phoneNumber
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Firebase Sign-In (for existing users)
exports.firebaseSignIn = async (req, res) => {
  try {
    const { idToken, provider, account_type } = req.body;

    // Verify the Firebase ID token with Firebase Admin SDK, not the client SDK.
    const firebaseUser = await verifyFirebaseLogin(idToken, provider);

    // Use the verified email from Firebase instead of trusting req.body.email.
    let user = await User.findOne({ where: { email: firebaseUser.email } });

    if (!user) {
      return res.status(404).json({ 
        message: "User not found. Please sign up first." 
      });
    }

    // Update user info if needed
    const updateData = {};
    if (firebaseUser.name && user.name !== firebaseUser.name) {
      updateData.name = firebaseUser.name;
    }
    if (account_type && user.account_type !== account_type) {
      updateData.account_type = account_type;
    }

    if (Object.keys(updateData).length > 0) {
      await user.update(updateData);
    }

    return sendAuthResponse(res, user, "Sign in successful");

  } catch (error) {
    console.error("Firebase sign-in error:", error);
    res.status(401).json({ 
      message: "Invalid Firebase token or authentication failed" 
    });
  }
};

// Firebase Sign-Up (for new users)
exports.firebaseSignUp = async (req, res) => {
  try {
    const { idToken, provider, account_type } = req.body;

    // Verify the Firebase ID token with Firebase Admin SDK, not the client SDK.
    const firebaseUser = await verifyFirebaseLogin(idToken, provider);

    // Use the verified email from Firebase instead of trusting req.body.email.
    const existingUser = await User.findOne({ where: { email: firebaseUser.email } });
    if (existingUser) {
      return res.status(400).json({ 
        message: "Email already registered. Please sign in instead." 
      });
    }

    // Create new user with Firebase info. Password stays null because Firebase owns auth.
    const newUser = await User.create({
      name: firebaseUser.name || firebaseUser.email.split("@")[0],
      email: firebaseUser.email,
      account_type: account_type || "volunteer",
      phoneNumber: null,
      password: null
    });

    return sendAuthResponse(res, newUser, "Account created successfully", 201);

  } catch (error) {
    console.error("Firebase sign-up error:", error);
    res.status(500).json({ 
      message: "Account creation failed" 
    });
  }
};
