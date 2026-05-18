const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB, sequelize } = require("./config/db");

const User = require("./models/User");
const Food = require("./models/Food");
const FoodRequest = require("./models/FoodRequest");

const authRoutes = require("./routes/authRoutes");
const foodRoutes = require("./routes/foodRoutes");
const requestRoutes = require("./routes/requestRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors({
  origin: "https://eco-bite-seven.vercel.app",
  credentials: true
}));

app.use(express.json());


User.hasMany(Food, {
  foreignKey: "restaurantId",
  as: "foods"
});

Food.belongsTo(User, {
  foreignKey: "restaurantId",
  as: "restaurant"
});

Food.belongsTo(User, {
  foreignKey: "claimedBy",
  as: "claimer"
});

// User ↔ FoodRequest
User.hasMany(FoodRequest, {
  foreignKey: "restaurantId",
  as: "incomingRequests"
});

User.hasMany(FoodRequest, {
  foreignKey: "ngoId",
  as: "outgoingRequests"
});

User.hasMany(FoodRequest, {
  foreignKey: "volunteerId",
  as: "volunteerAssignments"
});

FoodRequest.belongsTo(User, {
  foreignKey: "restaurantId",
  as: "restaurant"
});

FoodRequest.belongsTo(User, {
  foreignKey: "ngoId",
  as: "ngo"
});

FoodRequest.belongsTo(User, {
  foreignKey: "volunteerId",
  as: "volunteer"
});

// Food ↔ FoodRequest
Food.hasMany(FoodRequest, {
  foreignKey: "foodId",
  as: "requests"
});

FoodRequest.belongsTo(Food, {
  foreignKey: "foodId",
  as: "food"
});

// ======================
// Routes
// ======================

app.get("/", (req, res) => {
  res.send("EcoBite Backend Running Successfully");
});

app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/users", userRoutes);

// ======================
// Start Server
// ======================

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();

    await sequelize.sync({ alter: true });
    console.log("Database synced successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server startup failed:", error);
  }
};

startServer();