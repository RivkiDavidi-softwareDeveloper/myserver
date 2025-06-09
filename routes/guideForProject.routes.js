const express = require("express");
const router = express.Router();
const guideController = require("../controllers/guideForProject.controller");

router.get("/WithSudentsAndSharers/", guideController.getAllGuidesForProjectWithSudentsAndSharers);
router.get("/", guideController.getAllGuidesForProject);
router.post("/", guideController.createGuideForProject);
router.put("/:id", guideController.updateGuideForProject);
router.delete("/:id", guideController.deleteGuideForProject);

module.exports = router;
