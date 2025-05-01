const { DifficultyStudent } = require("../models");

// שליפת כל הקשיים של תלמידים
exports.getAllDifficulties = async (req, res) => {
    try {
        const difficulties = await DifficultyStudent.findAll();
        res.json(difficulties);
    } catch (error) {
        res.status(500).json({ error: "Error fetching difficulties for students" });
    }
};
// שליפת כל הקשיים לפי קוד תלמיד
exports.getAllDifficultiesOfStudent = async (req, res) => {
    try {
        const { codeStudent } = req.query;
        const code = Number(codeStudent);
        if (isNaN(code)) {
            return res.status(400).json({ error: "Invalid code" });
        }
        const difficulties = await DifficultyStudent.findAll();

        if (code !== 0) {
            difficulties = difficulties.filter(d => d.DS_student_code === code);
        }
        res.json(difficulties);
    } catch (error) {
        res.status(500).json({ error: "Error fetching difficulties for students" });
    }
};
// הוספת קושי לתלמיד
exports.addDifficulty = async (req, res) => {
    try {
        const difficulty = await DifficultyStudent.create(req.body);
        res.status(201).json(difficulty);
    } catch (error) {
        res.status(500).json({ error: "Error adding difficulty for student" });
    }
};

// עדכון קושי לפי קוד
exports.updateDifficulty = async (req, res) => {
    try {
        const { DS_code } = req.params;
        const difficulty = await DifficultyStudent.findByPk(DS_code);
        if (!difficulty) return res.status(404).json({ error: "Difficulty not found" });

        await difficulty.update(req.body);
        res.json(difficulty);
    } catch (error) {
        res.status(500).json({ error: "Error updating difficulty for student" });
    }
};

// מחיקת קושי לפי קוד
exports.deleteDifficulty = async (req, res) => {
    try {
        const { DS_code } = req.params;
        const difficulty = await DifficultyStudent.findByPk(DS_code);
        if (!difficulty) return res.status(404).json({ error: "Difficulty not found" });

        await difficulty.destroy();
        res.json({ message: "Difficulty deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting difficulty for student" });
    }
};
