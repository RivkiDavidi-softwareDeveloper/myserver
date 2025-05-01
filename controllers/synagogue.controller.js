// controllers/synagogue.controller.js

const { Synagogue } = require("../models");

// שליפת כל בתי הכנסת
exports.getAllSynagogues = async (req, res) => {
    try {
        const synagogues = await Synagogue.findAll();
        synagogues.sort((a, b) => {
            return a.Sy_name.localeCompare(b.Sy_name);
        });
        res.json(synagogues);
    } catch (error) {
        res.status(500).json({ error: "Error fetching synagogues" });
    }
};
// שליפת בתי הכנסת לפי קוד קהילה
exports.getSynagoguesOfCommunity = async (req, res) => {
    try {
        const { codeCommunity } = req.query;
        const code = Number(codeCommunity);
        const synagogues = await Synagogue.findAll();
        // סינון לפי קוד קהילה
        if (code !== -1) {
            synagogues = synagogues.filter(s=>s.Sy_code_Community === code);
        }
        synagogues.sort((a, b) => {
            return a.Sy_name.localeCompare(b.Sy_name);
        });
        res.json(synagogues);
    } catch (error) {
        res.status(500).json({ error: "Error fetching synagogues" });
    }
};

// הוספת בית כנסת חדש
exports.addSynagogue = async (req, res) => {
    try {
        const synagogue = await Synagogue.create(req.body);
        res.status(201).json(synagogue);
    } catch (error) {
        res.status(500).json({ error: "Error adding synagogue" });
    }
};

// עדכון שם בית כנסת
exports.updateSynagogue = async (req, res) => {
    try {
        const { Sy_code } = req.params;
        const { Sy_name } = req.body;

        const synagogue = await Synagogue.findByPk(Sy_code);
        if (!synagogue) return res.status(404).json({ error: "Synagogue not found" });

        synagogue.Sy_name = Sy_name;
        await synagogue.save();

        res.json(synagogue);
    } catch (error) {
        res.status(500).json({ error: "Error updating synagogue" });
    }
};

// מחיקת בית כנסת
exports.deleteSynagogue = async (req, res) => {
    try {
        const { Sy_code } = req.params;
        const synagogue = await Synagogue.findByPk(Sy_code);
        if (!synagogue) return res.status(404).json({ error: "Synagogue not found" });

        await synagogue.destroy();
        res.json({ message: "Synagogue deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting synagogue" });
    }
};
