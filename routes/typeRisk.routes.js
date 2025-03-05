// routes/typeRisk.routes.js

const express = require("express");
const router = express.Router();
const typeRiskController = require("../controllers/typeRisk.controller");

// הגדרת הנתיבים עבור TypeRisk
router.get("/", typeRiskController.getAllTypeRisks);
router.post("/", typeRiskController.addTypeRisk);
router.put("/:TR_code", typeRiskController.updateTypeRisk);
router.delete("/:TR_code", typeRiskController.deleteTypeRisk);

module.exports = router;
