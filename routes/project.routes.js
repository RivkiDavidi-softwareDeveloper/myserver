const express = require("express");
const router = express.Router();
const projectController = require("../controllers/project.controller");

router.get("/", projectController.getAllProjects);
router.get("/:id", projectController.getProjectById);
router.post("/", projectController.addProject);
router.put("/:Pr_code", projectController.updateProject);
router.delete("/:Pr_code", projectController.deleteProject);

module.exports = router;
