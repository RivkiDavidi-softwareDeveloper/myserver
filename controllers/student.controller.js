// controllers/student.controller.js
const { Parent, Student, DifficultyStudent, StudiesForStudent, StudentForProject, FileForStudent,
    StudentForActivity, City, Worker, Synagogue, CommonStudentForWorker } = require('../models');

const { clean } = require('../utils/cleaner');
const fs = require('fs');
const path = require('path');
const XLSX = require("xlsx");
const { Op, Sequelize, DATE } = require('sequelize');

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
        const currentYear = new Date().getFullYear();

        // יצירת פרטי לימודים
        await StudiesForStudent.create({
            ...studiesData,
            SFS_student_code: studentCode,
            SFS_last_upgrade_year: currentYear - 1
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
        await CommonStudentForWorker.destroy({ where: { CSFP_code_student: studentCode } });
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
        if (!fs.existsSync(imagePath)) {

            return res.status(404).json({ error: 'התמונה לא נמצאה' });
        }

        res.sendFile(imagePath);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאה בשליפת תמונה' });
    }
};
//העלאת קובץ אקסל חניכים
exports.importFromExcel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "לא נשלח קובץ" });
        }
        console.log(req.file.originalname)

        const imageDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(imageDir)) {
            fs.mkdirSync(imageDir, { recursive: true });
        }

        /*קבייעת שם תמונה עם תאריך ושעה  
             const now = new Date();
              const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
              const formattedTime = `${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}`;
              const timestamp = `${formattedDate}_${formattedTime}`;
       */
        const filePath = path.join(imageDir, `${req.file.originalname}.xlsx`);
        fs.writeFileSync(filePath, req.file.buffer);

        const workbook = XLSX.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { range: 1 }); // skip first row

        for (const row of rows) {
            const t = await Student.sequelize.transaction();

            let Pa_name = row["שם אב"];
            if (Pa_name == null) {
                Pa_name = ""
            }
            let Pa_ID = row["ת.ז אב"];
            let Pa_work = row["עיסוק אב"];
            let Pa_cell_phone = row["פל' אב"];
            if (Pa_ID != null) {

                // יצירת/עדכון הורה אב
                const father = await Parent.findOne({ where: { Pa_ID: Pa_ID } });
                if (father) {
                    father = await Parent.update(Pa_ID, Pa_name, Pa_cell_phone, Pa_work, {
                        where: { Pa_code: father.Pa_code },
                        transaction: t
                    });
                }
                else {
                    father = await Parent.create({ Pa_ID, Pa_name, Pa_cell_phone, Pa_work }, { transaction: t });
                }
            }
            else {
                father = await Parent.create({ Pa_ID, Pa_name, Pa_cell_phone, Pa_work }, { transaction: t });
            }


            Pa_name = row["שם האם"];
            if (Pa_name == null) {
                Pa_name = ""
            }
            Pa_ID = row["ת.ז. האם"];
            Pa_work = "";
            Pa_cell_phone = row["פל' אם"];
            if (Pa_ID != null) {

                // יצירת/עדכון הורה אם
                const mother = await Parent.findOne({ where: { Pa_ID: Pa_ID } });
                if (mother) {
                    mother = await Parent.update(Pa_ID, Pa_name, Pa_cell_phone, Pa_work, {
                        where: { Pa_code: mother.Pa_code },
                        transaction: t
                    });
                }
                else {
                    mother = await Parent.create({ Pa_ID, Pa_name, Pa_cell_phone, Pa_work }, { transaction: t });
                }
            }
            else {
                mother = await Parent.create({ Pa_ID, Pa_name, Pa_cell_phone, Pa_work }, { transaction: t });
            }
            //פריט תלמיד
            const St_ID = row["ת.ז"];
            const St_name = row["שם פרטי"];
            const St_Fname = row["שם משפחה"];
            const gender = row["מגדר"];
            let St_gender = 1
            if (gender == "בת") { St_gender = 2 }
            console.log(gender + "מגדר")
            const rawDate = row["תאריך לידה"];
            let St_birthday = "";
            let jsDate;
            if (typeof rawDate === 'number') {
                jsDate = XLSX.SSF.parse_date_code(rawDate);
                const year = jsDate.y;
                const month = String(jsDate.m).padStart(2, '0');
                const day = String(jsDate.d).padStart(2, '0');
                St_birthday = `${year}-${month}-${day}`;
            }
            else {
                console.error("פורמט לא מזוהה:", rawDate);
            }

            const St_address = row["כתובת"];
            const St_cell_phone = row["פלאפון חניך"];
            const St_phone = row["טלפון בית"];
            const St_email = row["מייל"];
            const St_father_code = father.Pa_code;
            const St_mother_code = mother.Pa_code;
            const activityStatus = row["מצב פעילות"];
            let St_activity_status = 1;
            if (activityStatus == "מושהה") {
                St_activity_status = 2
            }
            else {
                if (activityStatus == "הסתיים") {
                    St_activity_status = 3
                }
            }
            const nameCity = row["עיר"];
            let St_city_code = 1;
            if (nameCity) {
                const cityRecord = await City.findOne({ where: { Ci_name: nameCity.trim() } });
                if (cityRecord) {
                    St_city_code = cityRecord.Ci_code;
                }
                else {
                    const cityRecord = await City.findOne({ where: { Ci_name: "לא ידוע" } });
                    if (cityRecord) {
                        St_city_code = cityRecord.Ci_code;
                    }
                    else {
                        const cityRecord = await City.create({ Ci_name: "לא ידוע" }, { transaction: t });
                        if (cityRecord) {
                            St_city_code = cityRecord.Ci_code;
                        }
                    }
                }
            }
            const nameWorker = row["פעיל/חונך ישיר"];
            let St_worker_code = 1;
            if (nameWorker) {
                const workerRecord = await Worker.findOne({
                    where: {
                        [Op.and]: [{
                            [Op.or]: [
                                Sequelize.where(
                                    Sequelize.fn('concat', Sequelize.col('Wo_name'), ' ', Sequelize.col('Wo_Fname')),
                                    nameWorker // השוואת שם מלא
                                ),
                                Sequelize.where(
                                    Sequelize.fn('concat', Sequelize.col('Wo_name'), '  ', Sequelize.col('Wo_Fname')),
                                    nameWorker // השוואת שם מלא
                                ),
                                Sequelize.where(
                                    Sequelize.fn('concat', Sequelize.col('Wo_name'), ' ', Sequelize.col('Wo_Fname'), ' '),
                                    nameWorker // השוואת שם מלא
                                ),
                                Sequelize.where(
                                    Sequelize.fn('concat', ' ', Sequelize.col('Wo_name'), ' ', Sequelize.col('Wo_Fname')),
                                    nameWorker // השוואת שם מלא
                                ),
                                Sequelize.where(
                                    Sequelize.fn('concat', Sequelize.col('Wo_name'), ' ', Sequelize.col('Wo_Fname')),
                                    nameWorker // השוואת שם מלא
                                )
                            ]
                        }]
                    }
                });
                if (workerRecord) {
                    St_worker_code = workerRecord.Wo_code;
                }
                else {
                    const workerRecord = await Worker.findOne({ where: { Wo_name: "לא", Wo_Fname: "ידוע" } });
                    if (workerRecord) {
                        St_worker_code = workerRecord.Wo_code;
                    }
                    else {
                        const workerRecord = await Worker.create({ Wo_name: "לא", Wo_Fname: "ידוע" ,Wo_ID:"000000000" ,Wo_type_worker:1,Wo_gender:1,Wo_password:"0000"}, { transaction: t });
                        if (workerRecord) {
                            St_worker_code = workerRecord.Wo_code;
                        }
                    }
                }
            }
            else {
                const workerRecord = await Worker.findOne({ where: { Wo_name: "לא", Wo_Fname: "ידוע"} });
                if (workerRecord) {
                  
                    St_worker_code = workerRecord.Wo_code;
                }
                else {
                        const workerRecord = await Worker.create({ Wo_name: "לא", Wo_Fname: "ידוע" ,Wo_ID:"000000000" }, { transaction: t });
                        if (workerRecord) {
                            St_worker_code = workerRecord.Wo_code;
                        }
                    }
            }
            const risk = row["מצב סיכון"];
            let St_risk_code = 1;
            if (risk == "סיכון מוגבר") {
                St_risk_code = 2
            }
            else {
                if (risk == "לא במסגרת") {
                    St_risk_code = 3
                }
            }

            let St_description_reception_status = row["תיאור מצב קליטה"];
            const St_contact = row["איש צוות מקושר"];
            const St_contact_phone = row["פל' איש צוות מקושר"];
            const St_requester = row['הפניה התקבלה ע"י'];
            const St_socioeconomic_status = row["מצב סוציואקנומי (1-10)"];
            let St_code_synagogue = 1;
            const SynagogueRecord = await Synagogue.findOne({ where: { Sy_name: "לא ידוע" } });
            if (SynagogueRecord) {
                St_code_synagogue = SynagogueRecord.Sy_code;
            }
            const frequency = row["סוג"];
            let St_code_frequency = 1;
            if (frequency == "בשבועות") {
                St_code_frequency = 2
            }
            else {
                if (frequency == "בחודשים") {
                    St_code_frequency = 3
                }
            }
            let St_amount_frequency = row["כמות"];
            if (!St_ID || !St_name || !St_Fname) continue;
            // יצירת תלמיד עם קודי ההורים
            const student = await Student.create({
                St_ID: St_ID, St_name: St_name, St_Fname: St_Fname, St_gender: St_gender, St_birthday: St_birthday
                , St_address: St_address, St_cell_phone: St_cell_phone, St_phone: St_phone, St_father_code: St_father_code,
                St_mother_code: St_mother_code, St_email: St_email, St_activity_status: St_activity_status,
                St_city_code: St_city_code, St_worker_code: St_worker_code, St_risk_code: St_risk_code,
                St_description_reception_status: St_description_reception_status
                , St_contact: St_contact, St_contact_phone: St_contact_phone, St_requester: St_requester, St_socioeconomic_status: St_socioeconomic_status,
                St_code_synagogue: St_code_synagogue, St_code_frequency: St_code_frequency, St_amount_frequency: St_amount_frequency,
                St_name_school_bein_hazmanim: "", St_nusah_tfila: "", St_veshinantem: ""
            }, { transaction: t });

            const studentCode = student.St_code;

            const difficulties = []; // רשימת DifficultyStudent

            if (row["קשיים לימודיים"] === "כן") {
                difficulties.push({
                    DS_diffculty_code: 1,
                    DS_student_code: studentCode
                });
            }
            if (row["קשיים חברתיים"] === "כן") {
                difficulties.push({
                    DS_diffculty_code: 2,
                    DS_student_code: studentCode
                });
            }
            if (row["קשיים רוחניים"] === "כן") {
                difficulties.push({
                    DS_diffculty_code: 3,
                    DS_student_code: studentCode
                });
            }
            // יצירת קשיים
            if (difficulties.length > 0) {
                const difficultiesWithFK = difficulties.map(d => ({
                    ...d
                }));
                await DifficultyStudent.bulkCreate(difficultiesWithFK, { transaction: t });
            }

            const SFS_student_code = studentCode;
            const SFS_current_school = row["מוסד לימודים נוכחי"];
            const SFS_current_school_ame = row["שם המוסד"];
            const SFS_reception_class = row["שיעור/כיתה בקליטה"];
            const SFS_current_class = row["שיעור/כיתה נוכחי"];
            const SFS_previous_institutions = row["ישיבות קודמות"];
            const SFS_previous_school = row["תלמוד תורה קודם"];
            const currentYear = new Date().getFullYear();

            // יצירת פרטי לימודים
            await StudiesForStudent.create({
                SFS_student_code: SFS_student_code, SFS_current_school: SFS_current_school, SFS_current_school_ame: SFS_current_school_ame,
                SFS_reception_class: SFS_reception_class, SFS_current_class: SFS_current_class,
                SFS_previous_institutions: SFS_previous_institutions, SFS_previous_school: SFS_previous_school, SFS_last_upgrade_year: currentYear - 1

            }, { transaction: t });
            await t.commit();

        }

        fs.unlinkSync(filePath); // clean up
        res.json({ message: "הייבוא הושלם בהצלחה" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "שגיאה בייבוא" });
    }
};


