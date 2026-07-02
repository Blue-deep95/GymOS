const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

// Protect all routes under owner router to 'owner' role
router.use(authMiddleware);
router.use(authorizeRoles('owner'));

// Owner Operational Stats
router.get('/dashboard', ownerController.getDashboardStats);

// Operational Reports Aggregations
router.get('/reports', ownerController.getReportsData);

// Members and Trainers Management
router.get('/members', ownerController.getMembersList);
router.get('/trainers', ownerController.getTrainersList);
router.post('/trainers', ownerController.createTrainer);

module.exports = router;
