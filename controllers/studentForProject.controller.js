const { literal } = require("sequelize");
const { StudentForProject, Project, Student, GuideForProject } = require("../models");

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
// יצירה חדשה
exports.createStudentForProject = async (req, res) => {
    try {
        const { SFP_code, ...data } = req.body;
        const newRow = await StudentForProject.create(data);
        res.status(201).json(newRow);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

// עדכון
exports.updateStudentForProject = async (req, res) => {
    try {
        const { id } = req.params;
        const row = await StudentForProject.findByPk(id);
        if (!row) return res.status(404).json({ error: "לא נמצא" });

        await row.update(req.body);
        res.json(row);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
/* // עדכון  
exports.updateSharerForProject = async (req, res) => {
    try {
        const { SFP_code } = req.params;
        const { SFP_code_project, SFP_code_Sharer, SFP_code_guide, SFP_name_school_bein_hazmanim, SFP_veshinantem } = req.body;

        const sharerForProject = await SharerForProject.findByPk(SFP_code);
        if (!sharerForProject) return res.status(404).json({ error: "project not found" });
        sharerForProject.SFP_code_project = SFP_code_project;
        sharerForProject.SFP_code_Sharer = SFP_code_Sharer;
        sharerForProject.SFP_code_guide = SFP_code_guide;
        sharerForProject.SFP_name_school_bein_hazmanim = SFP_name_school_bein_hazmanim;
        sharerForProject.SFP_veshinantem = SFP_veshinantem;
        await sharerForProject.save();
        const updatedsharerForProject = await SharerForProject.findByPk(SFP_code);
        res.json(updatedsharerForProject);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error updating project" });
    }
}; */

// מחיקה
exports.deleteStudentForProject = async (req, res) => {
    try {
        const { id } = req.params;
        const row = await StudentForProject.findByPk(id);
        if (!row) return res.status(404).json({ error: "החניך לא נמצא" });
        await row.destroy();
        res.json({ message: "נמחק בהצלחה" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
