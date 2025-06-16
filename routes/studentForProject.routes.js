const express = require("express");
const router = express.Router();
const controller = require("../controllers/studentForProject.controller");

router.get("/", controller.getAllStudentForProjects);
router.get("/forStudent", controller.getAllProjectsForStudent);

/* router.get("/ofProject", controller.getStudentForProjectByCodeProject);
 */
router.post("/", controller.createStudentForProject);
router.post("/:codeWorker/:codeProject", controller.createStudentsForProjectForWorker);

router.put("/:SFP_code", controller.updateStudentForProject);
router.delete("/:id", controller.deleteStudentForProject);

module.exports = router;
