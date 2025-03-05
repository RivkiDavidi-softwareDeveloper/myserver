// controllers/call.controller.js

const { Call } = require("../models");

// שליפת כל השיחות
exports.getAllCalls = async (req, res) => {
    try {
        const calls = await Call.findAll();
        res.json(calls);
    } catch (error) {
        res.status(500).json({ error: "Error fetching calls" });
    }
};

// הוספת שיחה חדשה
exports.addCall = async (req, res) => {
    try {
        const call = await Call.create(req.body);
        res.status(201).json(call);
    } catch (error) {
        res.status(500).json({ error: "Error adding call" });
    }
};

// עדכון שיחה
exports.updateCall = async (req, res) => {
    try {
        const { Ca_code } = req.params;
        const { Ca_topic } = req.body;

        const call = await Call.findByPk(Ca_code);
        if (!call) return res.status(404).json({ error: "Call not found" });

        call.Ca_topic = Ca_topic;
        await call.save();

        res.json(call);
    } catch (error) {
        res.status(500).json({ error: "Error updating call" });
    }
};

// מחיקת שיחה
exports.deleteCall = async (req, res) => {
    try {
        const { Ca_code } = req.params;
        const call = await Call.findByPk(Ca_code);
        if (!call) return res.status(404).json({ error: "Call not found" });

        await call.destroy();
        res.json({ message: "Call deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting call" });
    }
};
