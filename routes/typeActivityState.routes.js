// routes/typeActivityState.routes.js

const express = require("express");
const router = express.Router();
const typeActivityStateController = require("../controllers/typeActivityState.controller");

// הגדרת הנתיבים עבור TypeActivityState
router.get("/", typeActivityStateController.getAllTypeActivityStates);
router.post("/", typeActivityStateController.addTypeActivityState);
router.put("/:TAS_code", typeActivityStateController.updateTypeActivityState);
router.delete("/:TAS_code", typeActivityStateController.deleteTypeActivityState);

module.exports = router;
