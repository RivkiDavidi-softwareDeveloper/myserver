// controllers/parent.controller.js

const { Parent } = require("../models");

// שליפת כל ההורים
exports.getAllParents = async (req, res) => {
    try {
        const parents = await Parent.findAll();
        res.json(parents);
    } catch (error) {
        res.status(500).json({ error: "Error fetching parents" });
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
// הוספת הורה חדש
exports.addParent = async (req, res) => {
    try {
        const parent = await Parent.create(req.body);
        res.status(201).json(parent);
    } catch (error) {
        res.status(500).json({ error: "Error adding parent" });
    }
};

// עדכון פרטי הורה
exports.updateParent = async (req, res) => {
    try {
        const { Pa_code } = req.params;
        const { Pa_ID, Pa_name, Pa_cell_phone, Pa_work } = req.body;

        const parent = await Parent.findByPk(Pa_code);
        if (!parent) return res.status(404).json({ error: "Parent not found" });

        parent.Pa_ID = Pa_ID;
        parent.Pa_name = Pa_name;
        parent.Pa_cell_phone = Pa_cell_phone;
        parent.Pa_work = Pa_work;
        await parent.save();

        res.json(parent);
    } catch (error) {
        res.status(500).json({ error: "Error updating parent" });
    }
};

// מחיקת הורה
exports.deleteParent = async (req, res) => {
    try {
        const { Pa_code } = req.params;
        const parent = await Parent.findByPk(Pa_code);
        if (!parent) return res.status(404).json({ error: "Parent not found" });

        await parent.destroy();
        res.json({ message: "Parent deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting parent" });
    }
};
