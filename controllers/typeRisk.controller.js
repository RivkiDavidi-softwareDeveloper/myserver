// controllers/typeRisk.controller.js

const { TypeRisk } = require("../models");

// שליפת כל הרשומות
exports.getAllTypeRisks = async (req, res) => {
    try {
        const risks = await TypeRisk.findAll();
        res.json(risks);
    } catch (error) {
        res.status(500).json({ error: "Error fetching TypeRisks" });
    }
};

// הוספת רשומה חדשה
exports.addTypeRisk = async (req, res) => {
    try {
        const risk = await TypeRisk.create(req.body);
        res.status(201).json(risk);
    } catch (error) {
        res.status(500).json({ error: "Error adding TypeRisk" });
    }
};

// עדכון שם של רשומה
exports.updateTypeRisk = async (req, res) => {
    try {
        const { TR_code } = req.params;
        const { TR_name } = req.body;

        const risk = await TypeRisk.findByPk(TR_code);
        if (!risk) return res.status(404).json({ error: "Risk not found" });

        risk.TR_name = TR_name;
        await risk.save();

        res.json(risk);
    } catch (error) {
        res.status(500).json({ error: "Error updating TypeRisk" });
    }
};

// מחיקת רשומה
exports.deleteTypeRisk = async (req, res) => {
    try {
        const { TR_code } = req.params;
        const risk = await TypeRisk.findByPk(TR_code);
        if (!risk) return res.status(404).json({ error: "Risk not found" });

        await risk.destroy();
        res.json({ message: "Risk deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting TypeRisk" });
    }
};
