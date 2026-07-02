const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

// Protect all routes under trainer router to 'trainer' and 'owner' roles
router.use(authMiddleware);
router.use(authorizeRoles('trainer', 'owner'));

// Dashboard Stats
router.get('/dashboard', trainerController.getDashboardStats);

// Assigned Member Operations
router.get('/members', trainerController.getAssignedMembers);
router.post('/members/:id/assign-program', trainerController.assignProgram);
router.delete('/members/:id/assign-program', trainerController.removeProgram);
router.post('/members/:id/progress', trainerController.recordProgress);
router.get('/members/:id/progress', trainerController.getProgressHistory);
router.get('/members/:id/profile', trainerController.getMemberProfileDetail);

// Workout Templates CRUD
router.get('/templates', trainerController.getWorkoutTemplates);
router.post('/templates', trainerController.createWorkoutTemplate);
router.delete('/templates/:id', trainerController.deleteWorkoutTemplate);

module.exports = router;
