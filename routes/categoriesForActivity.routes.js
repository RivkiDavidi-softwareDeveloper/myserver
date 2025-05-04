const express = require("express");
const router = express.Router();
const controller = require("../controllers/categoriesForActivity.controller");

// שליפה של כל הרשומות
router.get("/", controller.getAll);

// שליפה לפי מזהה
router.get("/:id", controller.getById);

// יצירה
router.post("/", controller.create);

// עדכון
router.put("/:id", controller.update);

// מחיקה
router.delete("/:id", controller.remove);

module.exports = router;
