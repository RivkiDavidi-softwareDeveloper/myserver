// routes/typeOfActivity.routes.js

const express = require("express");
const router = express.Router();
const typeOfActivityController = require("../controllers/typeOfActivity.controller");

// הגדרת הנתיבים עבור TypeOfActivity
router.get("/", typeOfActivityController.getAllTypeOfActivities);
router.post("/", typeOfActivityController.addTypeOfActivity);
router.put("/:TOA_code", typeOfActivityController.updateTypeOfActivity);
router.delete("/:TOA_code", typeOfActivityController.deleteTypeOfActivity);

module.exports = router;
