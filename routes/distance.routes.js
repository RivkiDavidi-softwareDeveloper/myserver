const express = require('express');
const router = express.Router();
const distanceController = require('../controllers/distance.controller');

router.get('/', distanceController.getDistance);

module.exports = router;
