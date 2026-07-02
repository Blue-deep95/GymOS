const express = require('express');
const router = express.Router();
const receptionistController = require('../controllers/receptionistController');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

// Protect all routes under receptionist router to 'receptionist' and 'owner' roles
router.use(authMiddleware);
router.use(authorizeRoles('receptionist', 'owner'));

// Member operations
router.get('/members', receptionistController.getMembersList);
router.post('/members/:id/membership', receptionistController.assignMembership);
router.post('/members/:id/freeze', receptionistController.freezeMembership);
router.patch('/members/:id/assign-trainer', receptionistController.assignTrainer);
router.get('/trainers', receptionistController.getTrainersList);

// Attendance operations
router.post('/attendance/check-in', receptionistController.checkInMember);

module.exports = router;
