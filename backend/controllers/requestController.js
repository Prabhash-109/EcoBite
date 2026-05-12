const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const Food = require('../models/Food');
const User = require('../models/User');
const FoodRequest = require('../models/FoodRequest');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      ...decoded,
      account_type: decoded.account_type || decoded.role
    };
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const requireRole = (role) => (req, res, next) => {
  if (req.user?.account_type !== role) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

// NGO creates a request for a food item
exports.createRequest = async (req, res) => {
  try {
    const { foodId } = req.body;
    if (!foodId) return res.status(400).json({ message: 'foodId is required' });

    const food = await Food.findByPk(foodId, {
      include: [{ model: User, as: 'restaurant', attributes: ['id', 'name'] }]
    });
    if (!food) return res.status(404).json({ message: 'Food not found' });

    // Prevent requests if already claimed by someone else
    if (food.status !== 'available' && food.claimedBy !== req.user.id) {
      return res.status(400).json({ message: 'Food is no longer available' });
    }

    const existing = await FoodRequest.findOne({
      where: { foodId: food.id, ngoId: req.user.id, restaurantId: food.restaurantId }
    });
    if (existing) return res.json(existing);

    const created = await FoodRequest.create({
      foodId: food.id,
      ngoId: req.user.id,
      restaurantId: food.restaurantId,
      status: 'pending'
    });

    return res.status(201).json(created);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Restaurant fetches all requests sent to them
exports.getRestaurantRequests = async (req, res) => {
  try {
    const requests = await FoodRequest.findAll({
      where: { restaurantId: req.user.id },
      include: [
        { 
          model: User, 
          as: 'ngo', 
          attributes: ['id', 'name', 'email', 'phoneNumber'] 
        },
        { 
          model: Food, 
          as: 'food', 
          attributes: ['id', 'foodName', 'quantity', 'category', 'createdAt'] 
        },
        {
          model: User,
          as: 'volunteer',
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.json(requests);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};
// NGO fetches their own requests (for status display)
exports.getNgoRequests = async (req, res) => {
  try {
    const requests = await FoodRequest.findAll({
      where: { ngoId: req.user.id },
      include: [
        { model: User, as: 'restaurant', attributes: ['id', 'name', 'email'] },
        { model: Food, as: 'food', attributes: ['id', 'foodName', 'quantity', 'category', 'createdAt', 'status', 'claimedBy'] },
        { model: User, as: 'volunteer', attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    return res.json(requests);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Restaurant accepts a request
exports.acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const fr = await FoodRequest.findByPk(requestId);
    if (!fr) return res.status(404).json({ message: 'Request not found' });
    if (fr.restaurantId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    if (fr.status === 'accepted') return res.json(fr);

    const food = await Food.findByPk(fr.foodId);
    if (!food) return res.status(404).json({ message: 'Food not found' });

    // Reserve the food for this NGO
    if (food.status !== 'available' && food.claimedBy !== fr.ngoId) {
      return res.status(400).json({ message: 'Food is no longer available' });
    }

    await fr.update({ status: 'accepted' });

    // Mark food claimed by NGO so it can show as accepted for that NGO
    await food.update({ status: 'claimed', claimedBy: fr.ngoId });

    // Reject other pending requests for same food (optional, but prevents confusion)
    await FoodRequest.update(
      { status: 'rejected' },
      {
        where: {
          id: { [Op.ne]: fr.id },
          foodId: fr.foodId,
          status: 'pending'
        }
      }
    );

    return res.json(fr);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// NGO assigns a volunteer to a delivery
exports.assignVolunteer = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { volunteerId } = req.body;

    if (!volunteerId) {
      return res.status(400).json({ message: 'volunteerId is required' });
    }

    const fr = await FoodRequest.findByPk(requestId);
    if (!fr) return res.status(404).json({ message: 'Request not found' });

    // Only the NGO who owns this request can assign
    if (fr.ngoId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Must be in accepted status to assign
    if (fr.status !== 'accepted') {
      return res.status(400).json({ message: 'Request must be accepted before assigning a volunteer' });
    }

    // Verify volunteer exists and is actually a volunteer
    const volunteer = await User.findByPk(volunteerId);
    if (!volunteer || volunteer.account_type !== 'volunteer') {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    await fr.update({
      volunteerId: volunteerId,
      status: 'assigned',
      assignedAt: new Date()
    });

    return res.json({
      message: `Volunteer ${volunteer.name} has been assigned successfully`,
      request: fr
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Volunteer fetches their own assignments (with full details)
exports.getVolunteerAssignments = async (req, res) => {
  try {
    const assignments = await FoodRequest.findAll({
      where: {
        volunteerId: req.user.id,
        status: { [Op.in]: ['assigned', 'picked_up', 'delivered'] }
      },
      include: [
        {
          model: Food,
          as: 'food',
          attributes: ['id', 'foodName', 'quantity', 'category', 'pickupTime', 'description', 'expiryDate']
        },
        {
          model: User,
          as: 'restaurant',
          attributes: ['id', 'name', 'email', 'phoneNumber']
        },
        {
          model: User,
          as: 'ngo',
          attributes: ['id', 'name', 'email', 'phoneNumber']
        }
      ],
      order: [['assignedAt', 'DESC']]
    });

    return res.json(assignments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Volunteer marks a task as picked up
exports.markPickedUp = async (req, res) => {
  try {
    const { requestId } = req.params;
    const fr = await FoodRequest.findByPk(requestId);
    if (!fr) return res.status(404).json({ message: 'Request not found' });

    if (fr.volunteerId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (fr.status !== 'assigned') {
      return res.status(400).json({ message: 'Task must be in assigned status' });
    }

    await fr.update({ status: 'picked_up' });

    // Also update the food status
    await Food.update({ status: 'picked_up' }, { where: { id: fr.foodId } });

    return res.json({ message: 'Marked as picked up', request: fr });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Volunteer marks a task as delivered
exports.markDelivered = async (req, res) => {
  try {
    const { requestId } = req.params;
    const fr = await FoodRequest.findByPk(requestId);
    if (!fr) return res.status(404).json({ message: 'Request not found' });

    if (fr.volunteerId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (fr.status !== 'assigned' && fr.status !== 'picked_up') {
      return res.status(400).json({ message: 'Task must be assigned or picked up' });
    }

    await fr.update({ status: 'delivered' });

    return res.json({ message: 'Marked as delivered', request: fr });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createRequest: [verifyToken, requireRole('ngo'), exports.createRequest],
  getRestaurantRequests: [verifyToken, requireRole('restaurant'), exports.getRestaurantRequests],
  getNgoRequests: [verifyToken, requireRole('ngo'), exports.getNgoRequests],
  acceptRequest: [verifyToken, requireRole('restaurant'), exports.acceptRequest],
  assignVolunteer: [verifyToken, requireRole('ngo'), exports.assignVolunteer],
  getVolunteerAssignments: [verifyToken, requireRole('volunteer'), exports.getVolunteerAssignments],
  markPickedUp: [verifyToken, requireRole('volunteer'), exports.markPickedUp],
  markDelivered: [verifyToken, requireRole('volunteer'), exports.markDelivered]
};
