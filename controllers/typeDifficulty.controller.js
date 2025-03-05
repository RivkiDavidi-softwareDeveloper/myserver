// controllers/typeDifficulty.controller.js

const { TypeDifficulty } = require("../models");

// שליפת כל הרשומות
exports.getAllTypeDifficulties = async (req, res) => {
    try {
        const difficulties = await TypeDifficulty.findAll();
        res.json(difficulties);
    } catch (error) {
        res.status(500).json({ error: "Error fetching TypeDifficulties" });
    }
};

// הוספת רשומה חדשה
exports.addTypeDifficulty = async (req, res) => {
    try {
        const difficulty = await TypeDifficulty.create(req.body);
        res.status(201).json(difficulty);
    } catch (error) {
        res.status(500).json({ error: "Error adding TypeDifficulty" });
    }
};

// עדכון שם של רשומה
exports.updateTypeDifficulty = async (req, res) => {
    try {
        const { TD_code } = req.params;
        const { TD_name } = req.body;

        const difficulty = await TypeDifficulty.findByPk(TD_code);
        if (!difficulty) return res.status(404).json({ error: "Difficulty not found" });

        difficulty.TD_name = TD_name;
        await difficulty.save();

        res.json(difficulty);
    } catch (error) {
        res.status(500).json({ error: "Error updating TypeDifficulty" });
    }
};

// מחיקת רשומה
exports.deleteTypeDifficulty = async (req, res) => {
    try {
        const { TD_code } = req.params;
        const difficulty = await TypeDifficulty.findByPk(TD_code);
        if (!difficulty) return res.status(404).json({ error: "Difficulty not found" });

        await difficulty.destroy();
        res.json({ message: "Difficulty deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting TypeDifficulty" });
    }
};
