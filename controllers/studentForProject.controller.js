const { literal } = require("sequelize");
const { StudentForProject, Project, Student, GuideForProject } = require("../models");
const { Op, Sequelize, DATE } = require('sequelize');

// שליפה של כל השורות
exports.getAllStudentForProjects = async (req, res) => {
    try {
        const { codeProject } = req.query;
        const projectCode = Number(codeProject);
        if (projectCode !== -1) {

            let studentsForProject = await StudentForProject.findAll({
                where: { SFP_code_project: projectCode },
                include: [

                    { model: Student },
                    { model: GuideForProject }
                ]
            });
            studentsForProject.sort((a, b) => {
                return a.Student.St_name.localeCompare(b.Student.St_name);
            });
            res.json(studentsForProject);
        }
        else {
            res.status(404).json({ error: "לא נמצא" });

        }
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error)
    }
};
// שליפה של כל הפרויקטים לחניך
exports.getAllProjectsForStudent = async (req, res) => {
    try {
        const { codeStudent } = req.query;
        const studentCode = Number(codeStudent);
        if (studentCode !== -1) {

            let studentsForProject = await StudentForProject.findAll({
                where: { SFP_code_student: studentCode },
                include: [

                    { model: Student },
                    { model: Project },
                    { model: GuideForProject }
                ]
            });
            studentsForProject.sort((a, b) => {
                return b.Project.Pr_date.localeCompare(a.Project.Pr_date);
            });
            res.json(studentsForProject);
        }
        else {
            res.status(404).json({ error: "לא נמצא" });

        }
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error)
    }
};
// יצירה חדשה
exports.createStudentForProject = async (req, res) => {
    try {
        const { SFP_code, ...data } = req.body;
        const newRow = await StudentForProject.create(data);
        const io = req.app.get("socketio");
        io.emit("studentsForProjects-updated"); // משדר לכל הלקוחות
        res.status(201).json(newRow);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

// הוספת חניכים לפרויקט לפי קוד פעיל
exports.createStudentsForProjectForWorker = async (req, res) => {
    //  const transaction = await Sequelize.transaction();
    const t = await Student.sequelize.transaction();

    try {
        const { codeWorker, codeProject } = req.params;
        let codeWorker1 = Number(codeWorker)
        let codeProject1 = Number(codeProject)

        let codeGuide = 1
        let guideRecord = await GuideForProject.findOne({ where: { GFP_code_project: codeProject1, GFP_name: "לא משויך למדריך" } });
        if (guideRecord) {
            codeGuide = guideRecord.GFP_code;
        }
        else {
            const guide = await GuideForProject.create({
                GFP_code_project: codeProject1, GFP_name: "לא משויך למדריך"
            }, { transaction: t });
            codeGuide = guide.GFP_code;
        }
        const listStudent = await Student.findAll({ where: { St_worker_code: codeWorker1 } });

        for (const student of listStudent) {
            let studentForProject = await StudentForProject.findOne(
                { where: { SFP_code_project: codeProject, SFP_code_student: student.St_code } }, { transaction: t });
            if (!studentForProject) {
                await StudentForProject.create({
                    SFP_code_project: codeProject,
                    SFP_code_student: student.St_code,
                    SFP_code_guide: codeGuide,
                    SFP_name_school_bein_hazmanim: "",
                    SFP_veshinantem: ""
                }, { transaction: t });
            }

        }

        await t.commit();
        const io = req.app.get("socketio");
        io.emit("studentsForProjects-updated"); // משדר לכל הלקוחות
        res.status(201).json({ message: "שויכו בהצלחה" });
    } catch (error) {
        await t.rollback();

        console.log(error);
        res.status(500).json({ error: error.message });
    }
};
// עדכון
exports.updateStudentForProject = async (req, res) => {
    try {
        const { SFP_code } = req.params;
        const row = await StudentForProject.findByPk(SFP_code);
        if (!row) return res.status(404).json({ error: "לא נמצא" });

        await row.update(req.body);
        const io = req.app.get("socketio");
        io.emit("studentsForProjects-updated"); // משדר לכל הלקוחות
        res.json(row);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// מחיקה
exports.deleteStudentForProject = async (req, res) => {
    try {
        const { id } = req.params;
        const row = await StudentForProject.findByPk(id);
        if (!row) return res.status(404).json({ error: "החניך לא נמצא" });
        await row.destroy();
        const io = req.app.get("socketio");
        io.emit("studentsForProjects-updated"); // משדר לכל הלקוחות
        res.json({ message: "נמחק בהצלחה" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
