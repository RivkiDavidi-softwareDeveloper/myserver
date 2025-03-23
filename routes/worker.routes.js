// routes/worker.routes.js

const express = require("express");
const router = express.Router();
const workerController = require("../controllers/worker.controller");

// הגדרת הנתיבים עבור Worker
router.get("/filter", workerController.getAllWorkers);
router.post("/", workerController.addWorker);
router.put("/:Wo_code", workerController.updateWorker);
router.delete("/:Wo_code", workerController.deleteWorker);

// Route חדש שמפנה לפונקציה שמחפשת עובד לפי שם וסיסמא
router.post('/login', workerController.getWorkerByNameAndPassword);

module.exports = router;
