const express = require('express');
const router = express.Router();
const statsController = require('../controllers/dashboard.controller');

router.get('/matrix', statsController.getMatrixStats);

module.exports = router;
