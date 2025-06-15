const express = require("express");
const router = express.Router();
const controller = require("../controllers/sharerForProject.controller");
const upload = require('../middlewares/upload');

router.get("/", controller.getAllSharerForProjects);
router.get("/forSharer", controller.getAllProjectsForSharer);
router.post("/", controller.createSharerForProject);
router.delete("/:id", controller.deleteSharerForProject);
router.put("/:SFP_code", controller.updateSharerForProject);

/*  router.post("/", controller.createStudentForProject);
router.put("/:id", controller.updateStudentForProject);
 */
// ייבוא מקובץ אקסל
router.post("/importExcel/:codeProject",  upload.single("file"), controller.importFromExcel);
module.exports = router;
