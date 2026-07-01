const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

// Protect all routes under member router to 'user' role (standard members)
router.use(authMiddleware);
router.use(authorizeRoles('user', 'member'));

// Member Dashboard Metrics
router.get('/dashboard', memberController.getDashboardData);

module.exports = router;
