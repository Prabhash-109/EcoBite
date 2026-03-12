const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connectDB = require("../config/db");

const db = connectDB();

exports.registerUser = async (req, res) => {

  const { account_type, name, email, password } = req.body;

  try {

    const hashedPassword = await bcrypt.hash(password, 10);

    const query =
      "INSERT INTO users (account_type, name, email, password) VALUES (?, ?, ?, ?)";

    db.query(
      query,
      [account_type, name, email, hashedPassword],
      (err, result) => {

        if (err) {

          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
              message: "Email already registered"
            });
          }

          return res.status(500).json({
            message: "Database error"
          });
        }

        res.status(201).json({
          message: "Registration successful"
        });

      }
    );

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }

};

// Login 
exports.loginUser = (req, res) => {

  const { email, password } = req.body;

  const query = "SELECT * FROM users WHERE email = ?";

  db.query(query, [email], async (err, results) => {

    if (err) {
      return res.status(500).json({
        message: "Database error"
      });
    }

    if (results.length === 0) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    // create token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

  res.json({
  message: "Login successful",
  token,
  id: user.id,
  role: user.account_type,
  name: user.name
});

  });

};