// controllers/student.controller.js
const { Parent, Student, DifficultyStudent, StudiesForStudent } = require('../models');

const { clean } = require('../utils/cleaner');


// שליפת כל החניכים 
exports.getAllStudents = async (req, res) => {
    try {
  
        const {value, order, genderF, statusF, workerF } = req.query;
;
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
            listStudents = listStudents.filter(s=>s.St_activity_status === statusFilter);
        }

        // סינון לפי קוד עובד
        if (workerFilter !== -1) {
            listStudents = listStudents.filter(s=>s.St_worker_code === workerFilter);
        }
        // סינון לפי טקסט
        if (searchValue) {
            listStudents = listStudents.filter(s => 
                s.St_name.toLowerCase().includes(searchValue) ||
                s.St_Fname.toLowerCase().includes(searchValue) ||
                (s.St_name+" "+s.St_Fname).toLowerCase().includes(searchValue) 

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
        res.status(201).json({ studentCode });

    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({ error: "שגיאה בהוספת תלמיד" });
    }
};


// עדכון פרטי סטודנט
exports.updateStudent = async (req, res) => {
    try {
        const { St_code } = req.params;
        const {
            St_ID,
            St_gender,
            St_name,
            St_Fname,
            St_image,
            St_birthday,
            St_father_code,
            St_mother_code,
            St_city_code,
            St_address,
            St_cell_phone,
            St_phone,
            St_email,
            St_worker_code,
            St_activity_status,
            St_risk_code,
            St_description_reception_status,
            St_contact,
            St_contact_phone,
            St_requester,
            St_socioeconomic_status,
            St_code_synagogue,
            St_code_frequency,
            St_amount_frequency
        } = req.body;

        const student = await Student.findByPk(St_code);
        if (!student) return res.status(404).json({ error: "Student not found" });

        // עדכון השדות של הסטודנט
        student.St_ID = St_ID;
        student.St_gender = St_gender;
        student.St_name = St_name;
        student.St_Fname = St_Fname;
        student.St_image = St_image;
        student.St_birthday = St_birthday;
        student.St_father_code = St_father_code;
        student.St_mother_code = St_mother_code;
        student.St_city_code = St_city_code;
        student.St_address = St_address;
        student.St_cell_phone = St_cell_phone;
        student.St_phone = St_phone;
        student.St_email = St_email;
        student.St_worker_code = St_worker_code;
        student.St_activity_status = St_activity_status;
        student.St_risk_code = St_risk_code;
        student.St_description_reception_status = St_description_reception_status;
        student.St_contact = St_contact;
        student.St_contact_phone = St_contact_phone;
        student.St_requester = St_requester;
        student.St_socioeconomic_status = St_socioeconomic_status;
        student.St_code_synagogue = St_code_synagogue;
        student.St_code_frequency = St_code_frequency;
        student.St_amount_frequency = St_amount_frequency;

        await student.save();
        res.json(student);
    } catch (error) {
        res.status(500).json({ error: "Error updating student" });
    }
};

// מחיקת סטודנט
exports.deleteStudent = async (req, res) => {
    try {
        const { St_code } = req.params;
        const student = await Student.findByPk(St_code);
        if (!student) return res.status(404).json({ error: "Student not found" });

        await student.destroy();
        res.json({ message: "Student deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting student" });
    }
};
