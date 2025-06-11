// routes/student.routes.js



const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student.controller");
const upload = require('../middlewares/upload');


// הגדרת הנתיבים עבור Student
router.get("/", studentController.getAllStudents);
router.post("/", studentController.addStudent);
router.put("/", studentController.updateStudent);
router.delete("/:St_code", studentController.deleteStudent);
router.post('/upload-student-image/', upload.single('image'), studentController.uploadStudentImage);//הוספת תמונה
router.get('/getStudentImage/:imageName', studentController.getStudentImage);
router.put("/:St_code", studentController.updateStudent2);//עדכון פרטי תלמיד בהוספת תלמיד לפרויקט בלבד ללא כל הטבלאות המקושרות


// ייבוא מקובץ אקסל
router.post("/importExcel", upload.single("file"), studentController.importFromExcel);

module.exports = router;
