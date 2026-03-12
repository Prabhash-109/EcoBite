const express = require('express');
const cors = require('cors'); 
require('dotenv').config();

const { connectDB, sequelize } = require('./config/db'); // Sequelize setup
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to DB
connectDB();

// Auto-create tables based on models
sequelize.sync({ alter: true }) // alter: true will update tables to match models
  .then(() => {
    console.log('All tables synced successfully!');
  })
  .catch((err) => {
    console.error('Error syncing tables:', err);
  });

// Routes
app.use('/api/auth', authRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});