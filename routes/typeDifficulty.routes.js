// routes/typeDifficulty.routes.js

const express = require("express");
const router = express.Router();
const typeDifficultyController = require("../controllers/typeDifficulty.controller");

// הגדרת הנתיבים עבור TypeDifficulty
router.get("/", typeDifficultyController.getAllTypeDifficulties);
router.post("/", typeDifficultyController.addTypeDifficulty);
router.put("/:TD_code", typeDifficultyController.updateTypeDifficulty);
router.delete("/:TD_code", typeDifficultyController.deleteTypeDifficulty);

module.exports = router;
