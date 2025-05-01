const { StudiesForStudent } = require("../models");

// שליפת כל הרשומות
exports.getAllStudies = async (req, res) => {
    try {
        const studies = await StudiesForStudent.findAll();
        res.json(studies);
    } catch (error) {
        res.status(500).json({ error: "Error fetching studies for student" });
    }
};
// שליפת רשומת לימודים לפי קוד תלמיד
exports.getStudiesOfCodeStudent = async (req, res) => {
    try {
        const { codeStudent } = req.query;
        const code = Number(codeStudent);
        if (isNaN(code)) {
            return res.status(400).json({ error: "Invalid code" });
        }
        const studies = await StudiesForStudent.findOne({ where: { SFS_student_code:code } });
        if (!studies) {
            return res.status(404).json({ error: "studies not found" });
        }
        res.json(studies);
    } catch (error) {
        res.status(500).json({ error: "Error fetching studies for student" });
    }
};
// שליפת הורה לפי קוד הורה
exports.getParentOfCode = async (req, res) => {
    try {
        const { codeParent } = req.query;
        const code = Number(codeParent);
        if (isNaN(code)) {
            return res.status(400).json({ error: "Invalid code" });
        }
        const parent = await Parent.findOne({ where: { Pa_code: code } });
        if (!parent) {
            return res.status(404).json({ error: "Parent not found" });
        }
        res.json(parent);
    } catch (error) {
        res.status(500).json({ error: "Error fetching parent" });
    }
};
// הוספת רשומה חדשה
exports.addStudy = async (req, res) => {
    try {
        const study = await StudiesForStudent.create(req.body);
        res.status(201).json(study);
    } catch (error) {
        res.status(500).json({ error: "Error adding study for student" });
    }
};

// עדכון רשומה לפי קוד
exports.updateStudy = async (req, res) => {
    try {
        const { SFS_code } = req.params;
        const study = await StudiesForStudent.findByPk(SFS_code);
        if (!study) return res.status(404).json({ error: "Study not found" });

        await study.update(req.body);
        res.json(study);
    } catch (error) {
        res.status(500).json({ error: "Error updating study for student" });
    }
};

// מחיקת רשומה לפי קוד
exports.deleteStudy = async (req, res) => {
    try {
        const { SFS_code } = req.params;
        const study = await StudiesForStudent.findByPk(SFS_code);
        if (!study) return res.status(404).json({ error: "Study not found" });

        await study.destroy();
        res.json({ message: "Study deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting study for student" });
    }
};
