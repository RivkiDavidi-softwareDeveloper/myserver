// routes/synagogue.routes.js

const express = require("express");
const router = express.Router();
const synagogueController = require("../controllers/synagogue.controller");

// הגדרת הנתיבים עבור Synagogue
router.get("/", synagogueController.getAllSynagogues);
router.post("/", synagogueController.addSynagogue);
router.put("/:Sy_code", synagogueController.updateSynagogue);
router.delete("/:Sy_code", synagogueController.deleteSynagogue);

module.exports = router;
