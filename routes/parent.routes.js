// routes/parent.routes.js

const express = require("express");
const router = express.Router();
const parentController = require("../controllers/parent.controller");

// הגדרת הנתיבים עבור Parent
router.get("/", parentController.getAllParents);
router.post("/", parentController.addParent);
router.put("/:Pa_code", parentController.updateParent);
router.delete("/:Pa_code", parentController.deleteParent);

module.exports = router;
