const router = require('express').Router();
const adminController = require('../controllers/adminController');
const { verifyAdmin } = require('../middleware/auth');

// All admin routes require an admin token
router.use(verifyAdmin);

// GET    /api/admin/overview
router.get('/overview', adminController.overview);

// GET    /api/admin/teams
router.get('/teams', adminController.teams);

// GET    /api/admin/rankings
router.get('/rankings', adminController.rankings);

// POST   /api/admin/attempts/:id/force-submit
router.post('/attempts/:id/force-submit', adminController.forceSubmit);

// DELETE /api/admin/teams/:teamNumber/reset
router.delete('/teams/:teamNumber/reset', adminController.resetAttempt);

module.exports = router;
