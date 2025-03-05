// controllers/typeActivityState.controller.js

const { TypeActivityState } = require("../models");

// שליפת כל הרשומות
exports.getAllTypeActivityStates = async (req, res) => {
    try {
        const states = await TypeActivityState.findAll();
        res.json(states);
    } catch (error) {
        res.status(500).json({ error: "Error fetching TypeActivityStates" });
    }
};

// הוספת רשומה חדשה
exports.addTypeActivityState = async (req, res) => {
    try {
        const state = await TypeActivityState.create(req.body);
        res.status(201).json(state);
    } catch (error) {
        res.status(500).json({ error: "Error adding TypeActivityState" });
    }
};

// עדכון שם של רשומה
exports.updateTypeActivityState = async (req, res) => {
    try {
        const { TAS_code } = req.params;
        const { TAS_name } = req.body;

        const state = await TypeActivityState.findByPk(TAS_code);
        if (!state) return res.status(404).json({ error: "State not found" });

        state.TAS_name = TAS_name;
        await state.save();

        res.json(state);
    } catch (error) {
        res.status(500).json({ error: "Error updating TypeActivityState" });
    }
};

// מחיקת רשומה
exports.deleteTypeActivityState = async (req, res) => {
    try {
        const { TAS_code } = req.params;
        const state = await TypeActivityState.findByPk(TAS_code);
        if (!state) return res.status(404).json({ error: "State not found" });

        await state.destroy();
        res.json({ message: "State deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting TypeActivityState" });
    }
};
