const express = require("express");
const router = express.Router();
const controller = require("../controllers/studentForProject.controller");

router.get("/", controller.getAllStudentForProjects);
/* router.get("/ofProject", synagogueController.getStudentForProjectByCodeProject);
 */router.post("/", controller.createStudentForProject);
router.put("/:id", controller.updateStudentForProject);
router.delete("/:id", controller.deleteStudentForProject);

module.exports = router;
