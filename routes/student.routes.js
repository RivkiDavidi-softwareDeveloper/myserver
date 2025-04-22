// routes/student.routes.js

const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student.controller");

// הגדרת הנתיבים עבור Student
router.get("/filter", studentController.getAllStudents);
router.post("/", studentController.addStudent);
router.put("/:St_code", studentController.updateStudent);
router.delete("/:St_code", studentController.deleteStudent);

module.exports = router;
