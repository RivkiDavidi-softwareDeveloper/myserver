// controllers/student.controller.js
const { Parent, Student, DifficultyStudent, StudiesForStudent,StudentForProject,FileForStudent,StudentForActivity } = require('../models');

const { clean } = require('../utils/cleaner');
const fs = require('fs');
const path = require('path');
// שליפת כל החניכים 
exports.getAllStudents = async (req, res) => {
    try {

        const { value, order, genderF, statusF, workerF } = req.query;
        const genderOrder = Number(order);
        const genderFilter = Number(genderF);
        const statusFilter = Number(statusF);
        const workerFilter = Number(workerF);

        const searchValue = value ? value.toLowerCase() : null;
        let listStudents = await Student.findAll({
        });

        // סינון לפי מגדר
        if (genderFilter !== 0) {
            listStudents = listStudents.filter(s => s.St_gender === genderFilter);
        }
        // סינון לפי סוג סטטוס
        if (statusFilter !== 0) {
            listStudents = listStudents.filter(s => s.St_activity_status === statusFilter);
        }

        // סינון לפי קוד עובד
        if (workerFilter !== -1) {
            listStudents = listStudents.filter(s => s.St_worker_code === workerFilter);
        }
        // סינון לפי טקסט
        if (searchValue) {
            listStudents = listStudents.filter(s =>
                s.St_name.toLowerCase().includes(searchValue) ||
                s.St_Fname.toLowerCase().includes(searchValue) ||
                (s.St_name + " " + s.St_Fname).toLowerCase().includes(searchValue)

            );
        }

        // סידור הרשימה
        listStudents.sort((a, b) => {
            let result = 0;
            if (genderOrder === 1) {
                result = a.St_gender - b.St_gender;
            }
            if (result === 0) {
                result = a.St_name.localeCompare(b.St_name);
            }
            return result;
        });
        res.json(listStudents);
    } catch (error) {
        res.status(500).json({ error: "Error fetching workers" });
    }
}
// הוספת סטודנט חדש
exports.addStudent = async (req, res) => {
    const [studentDataRaw, parentFDataRaw, parentMDataRaw, difficultiesDataRaw, studiesDataRaw] = req.body.data;
    const t = await Student.sequelize.transaction();
    try {
        const parentFData = clean(parentFDataRaw, ['Pa_code']);
        const parentMData = clean(parentMDataRaw, ['Pa_code']);
        const studentData = clean(studentDataRaw, ['St_code']);
        const studiesData = clean(studiesDataRaw, ['SFS_code']);

        const cleanedDifficulties = difficultiesDataRaw.map(d => clean(d, ['DS_code']));

        // יצירת הורה אב
        const father = await Parent.create(parentFData, { transaction: t });

        // יצירת הורה אם
        const mother = await Parent.create(parentMData, { transaction: t });

        // יצירת תלמיד עם קודי ההורים
        const student = await Student.create({
            ...studentData,
            St_father_code: father.Pa_code,
            St_mother_code: mother.Pa_code
        }, { transaction: t });

        const studentCode = student.St_code;

        // יצירת קשיים
        if (cleanedDifficulties.length > 0) {
            const difficultiesWithFK = cleanedDifficulties.map(d => ({
                ...d,
                DS_student_code: studentCode
            }));
            await DifficultyStudent.bulkCreate(difficultiesWithFK, { transaction: t });
        }

        // יצירת פרטי לימודים
        await StudiesForStudent.create({
            ...studiesData,
            SFS_student_code: studentCode
        }, { transaction: t });

        await t.commit();
        res.status(201).json(student);

    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({ error: "שגיאה בהוספת תלמיד" });
    }
};
// עדכון פרטי סטודנט
exports.updateStudent = async (req, res) => {
    const [studentDataRaw, parentFDataRaw, parentMDataRaw, difficultiesDataRaw, studiesDataRaw] = req.body.data;
    const t = await Student.sequelize.transaction();
    try {
        const parentFData = clean(parentFDataRaw, ['Pa_code']);
        const parentMData = clean(parentMDataRaw, ['Pa_code']);
        const studentData = clean(studentDataRaw, ['St_code']);
        const studiesData = clean(studiesDataRaw, ['SFS_code']);
        const cleanedDifficulties = difficultiesDataRaw.map(d => clean(d, ['DS_code']));

        const studentCode = studentDataRaw.St_code;

        // עדכון הורה אב
        await Parent.update(parentFData, {
            where: { Pa_code: parentFDataRaw.Pa_code },
            transaction: t
        });

        // עדכון הורה אם
        await Parent.update(parentMData, {
            where: { Pa_code: parentMDataRaw.Pa_code },
            transaction: t
        });

        // עדכון תלמיד
        await Student.update({
            ...studentData,
            St_father_code: parentFDataRaw.Pa_code,
            St_mother_code: parentMDataRaw.Pa_code
        }, {
            where: { St_code: studentCode },
            transaction: t
        });

        // מחיקת קשיים קיימים
        await DifficultyStudent.destroy({
            where: { DS_student_code: studentCode },
            transaction: t
        });

        // הוספת קשיים חדשים
        if (cleanedDifficulties.length > 0) {
            const difficultiesWithFK = cleanedDifficulties.map(d => ({
                ...d,
                DS_student_code: studentCode
            }));
            await DifficultyStudent.bulkCreate(difficultiesWithFK, { transaction: t });
        }

        // עדכון או יצירת פרטי לימודים
        const existingStudies = await StudiesForStudent.findOne({
            where: { SFS_student_code: studentCode },
            transaction: t
        });

        if (existingStudies) {
            await StudiesForStudent.update(studiesData, {
                where: { SFS_student_code: studentCode },
                transaction: t
            });
        } else {
            await StudiesForStudent.create({
                ...studiesData,
                SFS_student_code: studentCode
            }, { transaction: t });
        }

        await t.commit();
        res.status(200).json({ message: "התלמיד עודכן בהצלחה" });

    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({ error: "שגיאה בעדכון תלמיד" });
    }
};
// מחיקת סטודנט
exports.deleteStudent = async (req, res) => {
    const { St_code } = req.params;
    studentCode = St_code;
    try {
        const student = await Student.findByPk(studentCode);
        if (!student) {
            return res.status(404).json({ message: "החניך לא קיים" });
        }

        // מחיקת תמונת סטודנט אם קיימת
        if (student.St_image) {
            const imagePath = path.join(__dirname, '../images/studentsImages', `${studentCode}.jpg`);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // מחיקת רשומות תלויות
        await StudentForActivity.destroy({ where: { SFA_code_student: studentCode } });
        await DifficultyStudent.destroy({ where: { DS_student_code: studentCode } });
        await FileForStudent.destroy({ where: { FFS_student_code: studentCode } });
        await StudentForProject.destroy({ where: { SFP_code_student: studentCode } });
        await StudiesForStudent.destroy({ where: { SFS_student_code: studentCode } });

        // מחיקת התלמיד
        await Student.destroy({ where: { St_code: studentCode } });

        return res.status(200).json({ message: "החניך נמחק בהצלחה" });

    } catch (error) {
        console.error("שגיאה במחיקת חניך", error);
        return res.status(500).json({ message: "שגיאה במחיקת חניך", error });
    }
};
//העלאת תמונה לחניך
exports.uploadStudentImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'לא נשלחה תמונה' });
    }

    try {
        const imageDir = path.join(__dirname, '../images/studentsImages'); // תיקיית תמונות/חניכים
        if (!fs.existsSync(imageDir)) {
            fs.mkdirSync(imageDir, { recursive: true });
        }

        const imagePath = path.join(imageDir, `${req.file.originalname}.jpg`);
        fs.writeFileSync(imagePath, req.file.buffer);

        res.status(200).json({ message: 'התמונה נשמרה בהצלחה' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאה בשמירת תמונה' });
    }
};
//שליפת תמונה חניך
exports.getStudentImage = async (req, res) => {
    try {
        const { imageName } = req.params;

        const imagePath = path.join(__dirname, '../images/studentsImages', `${imageName}.jpg`);
        console.log(imagePath);
        if (!fs.existsSync(imagePath)) {

            return res.status(404).json({ error: 'התמונה לא נמצאה' });
        }

        res.sendFile(imagePath);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאה בשליפת תמונה' });
    }
};


