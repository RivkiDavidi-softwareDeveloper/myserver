const express = require("express");
const router = express.Router();
const controller = require("../controllers/difficultyStudent.controller");

router.get("/", controller.getAllDifficulties);
router.get("/OfCodeStudent", controller.getAllDifficultiesOfStudent);
router.post("/", controller.addDifficulty);
router.put("/:DS_code", controller.updateDifficulty);
router.delete("/:DS_code", controller.deleteDifficulty);

module.exports = router;
