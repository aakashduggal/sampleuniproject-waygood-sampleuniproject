const express = require('express');
const router = express.Router();
const recommendationsController = require('../controllers/recommendationsController');

// POST /api/recommendations
router.post('/', recommendationsController.getRecommendations);

module.exports = router;