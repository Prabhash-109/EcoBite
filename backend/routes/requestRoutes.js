const express = require('express');
const router = express.Router();

const {
  createRequest,
  getRestaurantRequests,
  getNgoRequests,
  acceptRequest,
  assignVolunteer,
  getVolunteerAssignments,
  markPickedUp,
  markDelivered
} = require('../controllers/requestController');

// NGO creates request for a specific foodId
router.post('/', createRequest);

// Restaurant views requests sent to them
router.get('/restaurant', getRestaurantRequests);

// NGO views their own requests (to show accepted/pending)
router.get('/ngo', getNgoRequests);

// Volunteer views their assigned tasks
router.get('/volunteer', getVolunteerAssignments);

// Restaurant accepts a request
router.patch('/:requestId/accept', acceptRequest);

// NGO assigns a volunteer to an accepted request
router.patch('/:requestId/assign', assignVolunteer);

// Volunteer marks task as picked up
router.patch('/:requestId/picked-up', markPickedUp);

// Volunteer marks task as delivered
router.patch('/:requestId/delivered', markDelivered);

module.exports = router;
