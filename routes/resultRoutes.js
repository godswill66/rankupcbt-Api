const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');

// This matches the fetch URL in your HTML: /api/results/latest/:userId
router.get('/latest/:userId', resultController.getLatestResult);
router.post('/save', resultController.saveResult);

module.exports = router;