const { CategoriesForActivity } = require("../models");

// שליפה של כל הרשומות
exports.getAll = async (req, res) => {
    try {
        const records = await CategoriesForActivity.findAll();
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// שליפה לפי קוד
exports.getById = async (req, res) => {
    try {
        const id = req.params.id;
        const record = await CategoriesForActivity.findByPk(id);
        if (!record) return res.status(404).json({ message: "Not found" });
        res.json(record);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// יצירה
exports.create = async (req, res) => {
    try {
        const newRecord = await CategoriesForActivity.create(req.body);
        res.status(201).json(newRecord);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// עדכון
exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const record = await CategoriesForActivity.findByPk(id);
        if (!record) return res.status(404).json({ message: "Not found" });

        await record.update(req.body);
        res.json(record);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// מחיקה
exports.remove = async (req, res) => {
    try {
        const id = req.params.id;
        const record = await CategoriesForActivity.findByPk(id);
        if (!record) return res.status(404).json({ message: "Not found" });

        await record.destroy();
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
