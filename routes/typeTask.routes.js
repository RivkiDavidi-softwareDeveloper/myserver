// routes/typeTask.routes.js

const express = require("express");
const router = express.Router();
const typeTaskController = require("../controllers/typeTask.controller");

// הגדרת הנתיבים עבור TypeTask
router.get("/", typeTaskController.getAllTypeTasks);
router.post("/", typeTaskController.addTypeTask);
router.put("/:TT_code", typeTaskController.updateTypeTask);
router.delete("/:TT_code", typeTaskController.deleteTypeTask);

module.exports = router;
