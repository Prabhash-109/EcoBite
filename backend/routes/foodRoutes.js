const express = require('express');
const router = express.Router();
const {
  createFood,
  getRestaurantFoods,
  getAvailableFoods,
  claimFood
} = require('../controllers/foodController');

// Create new food donation
router.post('/donate', createFood);

// Get restaurant's food donations
router.get('/my-donations', getRestaurantFoods);

// Get all available food donations
router.get('/available', getAvailableFoods);

// Claim a food donation
router.patch('/claim/:foodId', claimFood);

module.exports = router;
