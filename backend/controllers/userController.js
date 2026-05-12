const User = require('../models/User');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

exports.getVolunteers = async (req, res) => {
  try {
    const volunteers = await User.findAll({
      where: { account_type: 'volunteer' },
      attributes: ['id', 'name', 'email', 'phoneNumber'],
      order: [['createdAt', 'DESC']]
    });
    return res.json(volunteers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getVolunteers: [verifyToken, requireRole('ngo'), exports.getVolunteers]
};

