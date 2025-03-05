// controllers/typeGender.controller.js

const { TypeGender } = require("../models");

// שליפת כל הרשומות
exports.getAllTypeGenders = async (req, res) => {
    try {
        const genders = await TypeGender.findAll();
        res.json(genders);
    } catch (error) {
        res.status(500).json({ error: "Error fetching TypeGenders" });
    }
};

// הוספת רשומה חדשה
exports.addTypeGender = async (req, res) => {
    try {
        const gender = await TypeGender.create(req.body);
        res.status(201).json(gender);
    } catch (error) {
        res.status(500).json({ error: "Error adding TypeGender" });
    }
};

// עדכון שם של רשומה
exports.updateTypeGender = async (req, res) => {
    try {
        const { TG_code } = req.params;
        const { TG_name } = req.body;

        const gender = await TypeGender.findByPk(TG_code);
        if (!gender) return res.status(404).json({ error: "Gender not found" });

        gender.TG_name = TG_name;
        await gender.save();

        res.json(gender);
    } catch (error) {
        res.status(500).json({ error: "Error updating TypeGender" });
    }
};

// מחיקת רשומה
exports.deleteTypeGender = async (req, res) => {
    try {
        const { TG_code } = req.params;
        const gender = await TypeGender.findByPk(TG_code);
        if (!gender) return res.status(404).json({ error: "Gender not found" });

        await gender.destroy();
        res.json({ message: "Gender deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting TypeGender" });
    }
};
