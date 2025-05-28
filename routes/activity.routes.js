const express = require("express");
const router = express.Router();
const activityController = require("../controllers/activity.controller");

router.get("/", activityController.getAllActivities);
 router.get("/lastActivityForStudent/:studentCode", activityController.getLastActivityDateForStudent);

router.post("/", activityController.addActivity);
router.put("/:id", activityController.updateActivity);
/* router.delete("/:id", activityController.deleteActivity);
 */router.delete("/:id", activityController.deleteActivities);

module.exports = router;
