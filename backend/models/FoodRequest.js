const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const FoodRequest = sequelize.define(
  'FoodRequest',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    foodId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'foods', key: 'id' }
    },
    restaurantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    ngoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    volunteerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' }
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'assigned', 'picked_up', 'delivered'),
      allowNull: false,
      defaultValue: 'pending'
    },
    assignedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    tableName: 'food_requests',
    timestamps: true
  }
);

module.exports = FoodRequest;
