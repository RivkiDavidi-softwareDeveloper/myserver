const express = require("express");
const router = express.Router();
const studiesController = require("../controllers/studiesForStudentController");

router.get("/", studiesController.getAllStudies);
router.get("/OfCodeStudent", studiesController.getStudiesOfCodeStudent);
router.post("/", studiesController.addStudy);
router.put("/:SFS_code", studiesController.updateStudy);
router.delete("/:SFS_code", studiesController.deleteStudy);

module.exports = router;
