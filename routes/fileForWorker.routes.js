// routes/fileForWorker.routes.js

const express = require("express");
const router = express.Router();
const fileForWorkerController = require("../controllers/fileForWorker.controller");

// הגדרת הנתיבים עבור FileForWorker
router.get("/", fileForWorkerController.getAllFilesForWorker);
router.post("/", fileForWorkerController.addFileForWorker);
router.put("/:FFW_code", fileForWorkerController.updateFileForWorker);
router.delete("/:FFW_code", fileForWorkerController.deleteFileForWorker);

module.exports = router;
