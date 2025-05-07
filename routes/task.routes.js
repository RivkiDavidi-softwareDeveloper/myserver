// routes/task.routes.js

const express = require("express");
const router = express.Router();
const taskController = require("../controllers/task.controller");

// הגדרת הנתיבים עבור Task
router.get("/", taskController.getAllTasks)//לפי קוד עובד
router.get("/GetAmoumtTasksNotDoneForWorker", taskController.getAmoumtTasksNotDoneForWorker)//כמות המשימות שלא התבצעו עבוד קוד עובד  

router.post("/", taskController.addTask);
router.put("/:Ta_code", taskController.updateTask);
router.delete("/:Ta_code", taskController.deleteTask);

module.exports = router;
