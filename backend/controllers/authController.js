const bcrypt = require("bcryptjs");
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