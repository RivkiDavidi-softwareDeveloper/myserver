const { StudiesForSharer } = require("../models");
// שליפת כל הרשומות
exports.getAllStudies = async (req, res) => {
    try {
        const studies = await StudiesForSharer.findAll();
        res.json(studies);
    } catch (error) {
        res.status(500).json({ error: "Error fetching studies for sharer" });
    }
};
// שליפת רשומת לימודים לפי קוד משתתף
exports.getStudiesOfCodeSharer = async (req, res) => {
    try {
        const { codeSharer } = req.query;
        const code = Number(codeSharer);
        if (isNaN(code)) {
            return res.status(400).json({ error: "Invalid code" });
        }
        const studies = await StudiesForSharer.findOne({ where: { SFS_Sharer_code:code } });
        if (!studies) {
            return res.status(404).json({ error: "studies not found" });
        }
        res.json(studies);
    } catch (error) {
        res.status(500).json({ error: "Error fetching studies for student" });
    }
};

// הוספת רשומה חדשה
exports.addStudy = async (req, res) => {
    try {
        const study = await StudiesForSharer.create(req.body);
        res.status(201).json(study);
    } catch (error) {
        res.status(500).json({ error: "Error adding study for sharer" });
    }
};

// עדכון רשומה קיימת לפי קוד
exports.updateStudy = async (req, res) => {
    try {
        const { SFS_code } = req.params;
        const study = await StudiesForSharer.findByPk(SFS_code);
        if (!study) return res.status(404).json({ error: "Study not found" });

        await study.update(req.body);
        res.json(study);
    } catch (error) {
        res.status(500).json({ error: "Error updating study for sharer" });
    }
};

// מחיקת רשומה לפי קוד
exports.deleteStudy = async (req, res) => {
    try {
        const { SFS_code } = req.params;
        const study = await StudiesForSharer.findByPk(SFS_code);
        if (!study) return res.status(404).json({ error: "Study not found" });

        await study.destroy();
        res.json({ message: "Study deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting study for sharer" });
    }
};
