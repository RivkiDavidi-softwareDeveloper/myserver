// routes/frequency.routes.js

const express = require("express");
const router = express.Router();
const frequencyController = require("../controllers/frequency.controller");

// הגדרת הנתיבים עבור Frequency
router.get("/", frequencyController.getAllFrequencies);
router.post("/", frequencyController.addFrequency);
router.put("/:Fr_code", frequencyController.updateFrequency);
router.delete("/:Fr_code", frequencyController.deleteFrequency);

module.exports = router;
