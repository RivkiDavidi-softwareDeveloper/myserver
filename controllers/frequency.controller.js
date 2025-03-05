// controllers/frequency.controller.js

const { Frequency } = require("../models");

// שליפת כל הפרמטרים של Frequency
exports.getAllFrequencies = async (req, res) => {
    try {
        const frequencies = await Frequency.findAll();
        res.json(frequencies);
    } catch (error) {
        res.status(500).json({ error: "Error fetching frequencies" });
    }
};

// הוספת פרמטר Frequency חדש
exports.addFrequency = async (req, res) => {
    try {
        const frequency = await Frequency.create(req.body);
        res.status(201).json(frequency);
    } catch (error) {
        res.status(500).json({ error: "Error adding frequency" });
    }
};

// עדכון פרטי Frequency
exports.updateFrequency = async (req, res) => {
    try {
        const { Fr_code } = req.params;
        const { Fr_name } = req.body;

        const frequency = await Frequency.findByPk(Fr_code);
        if (!frequency) return res.status(404).json({ error: "Frequency not found" });

        frequency.Fr_name = Fr_name;
        await frequency.save();

        res.json(frequency);
    } catch (error) {
        res.status(500).json({ error: "Error updating frequency" });
    }
};

// מחיקת Frequency
exports.deleteFrequency = async (req, res) => {
    try {
        const { Fr_code } = req.params;
        const frequency = await Frequency.findByPk(Fr_code);
        if (!frequency) return res.status(404).json({ error: "Frequency not found" });

        await frequency.destroy();
        res.json({ message: "Frequency deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting frequency" });
    }
};
