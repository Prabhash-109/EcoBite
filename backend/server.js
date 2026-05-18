const express = require('express');
const cors = require('cors'); 
require('dotenv').config();
const { connectDB, sequelize } = require('./config/db')
const authRoutes = require('./routes/authRoutes');
const foodRoutes = require('./routes/foodRoutes');
const requestRoutes = require('./routes/requestRoutes');
const userRoutes = require('./routes/userRoutes');

// Import models for relationships
const User = require('./models/User');
const Food = require('./models/Food');
const FoodRequest = require('./models/FoodRequest');

const app = express();

// Middleware
app.use(cors({
  origin: "https://your-frontend.vercel.app",
  credentials: true
}));
app.use(express.json());

// Model relationships
User.hasMany(Food, { foreignKey: 'restaurantId', as: 'foods' });
Food.belongsTo(User, { foreignKey: 'restaurantId', as: 'restaurant' });
Food.belongsTo(User, { foreignKey: 'claimedBy', as: 'claimer' });

User.hasMany(FoodRequest, { foreignKey: 'restaurantId', as: 'incomingRequests' });
User.hasMany(FoodRequest, { foreignKey: 'ngoId', as: 'outgoingRequests' });
FoodRequest.belongsTo(User, { foreignKey: 'restaurantId', as: 'restaurant' });
FoodRequest.belongsTo(User, { foreignKey: 'ngoId', as: 'ngo' });
FoodRequest.belongsTo(User, { foreignKey: 'volunteerId', as: 'volunteer' });
User.hasMany(FoodRequest, { foreignKey: 'volunteerId', as: 'volunteerAssignments' });
Food.hasMany(FoodRequest, { foreignKey: 'foodId', as: 'requests' });
FoodRequest.belongsTo(Food, { foreignKey: 'foodId', as: 'food' });

// Routes
app.get("/", (req, res) => {
  res.send("EcoBite Backend Running Successfully");
});
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/users', userRoutes);

// Start Server
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();

  await sequelize.sync({ alter: true });
  console.log("All tables synced successfully!");

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Server startup failed:", err);
  process.exit(1);
});