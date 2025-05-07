const { StudentForProject, Project, Student, GuideForProject } = require("../models");

// שליפה של כל השורות
exports.getAllStudentForProjects = async (req, res) => {
    try {
        const { codeProject } = req.query;
        const projectCode = Number(codeProject);

        const studentsForProject = await StudentForProject.findAll({
            where: { SFP_code_project: projectCode }
        });

        res.json(studentsForProject);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error)
    }
};


// שליפה לפי קוד
exports.getStudentForProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await StudentForProject.findByPk(id, {
            include: [
                { model: Project },
                { model: Student },
                { model: GuideForProject }
            ]
        });
        if (!data) return res.status(404).json({ error: "לא נמצא" });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// יצירה חדשה
exports.createStudentForProject = async (req, res) => {
    try {
        const newRow = await StudentForProject.create(req.body);
        res.status(201).json(newRow);
    } catch (error) {
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

// מחיקה
exports.deleteStudentForProject = async (req, res) => {
    try {
        const { id } = req.params;
        const row = await StudentForProject.findByPk(id);
        if (!row) return res.status(404).json({ error: "לא נמצא" });

        await row.destroy();
        res.json({ message: "נמחק בהצלחה" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
