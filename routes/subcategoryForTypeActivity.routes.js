const express = require("express");
const router = express.Router();
const controller = require("../controllers/subcategoryForTypeActivity.controller");

router.get("/ofCodeCategory", controller.getSubcategoryOfCategory);
router.post("/", controller.addSubcategoryForTypeActivity);

// עדכון לפי מזהה
router.put("/:id", controller.update);

// מחיקה לפי מזהה
router.delete("/:id", controller.delete);

module.exports = router;
