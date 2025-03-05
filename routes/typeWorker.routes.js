// routes/typeWorker.routes.js

const express = require("express");
const router = express.Router();
const typeWorkerController = require("../controllers/typeWorker.controller");

// הגדרת הנתיבים עבור TypeWorker
router.get("/", typeWorkerController.getAllTypeWorkers);
router.post("/", typeWorkerController.addTypeWorker);
router.put("/:TW_code", typeWorkerController.updateTypeWorker);
router.delete("/:TW_code", typeWorkerController.deleteTypeWorker);

module.exports = router;
