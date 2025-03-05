// routes/typeGender.routes.js

const express = require("express");
const router = express.Router();
const typeGenderController = require("../controllers/typeGender.controller");

// הגדרת הנתיבים עבור TypeGender
router.get("/", typeGenderController.getAllTypeGenders);
router.post("/", typeGenderController.addTypeGender);
router.put("/:TG_code", typeGenderController.updateTypeGender);
router.delete("/:TG_code", typeGenderController.deleteTypeGender);

module.exports = router;
