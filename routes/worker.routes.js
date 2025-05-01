// routes/worker.routes.js

const express = require("express");
const router = express.Router();
const workerController = require("../controllers/worker.controller");

// הגדרת הנתיבים עבור Worker
router.get("/", workerController.getAllWorkers);
router.get("/OfCodeWorker", workerController.getWorkerOfCode);
router.post("/", workerController.addWorker);
router.put("/:Wo_code", workerController.updateWorker);
router.delete("/:Wo_code", workerController.deleteWorker);

// Route חדש שמפנה לפונקציה שמחפשת עובד לפי שם וסיסמא
router.post('/login', workerController.getWorkerByNameAndPassword);

module.exports = router;
