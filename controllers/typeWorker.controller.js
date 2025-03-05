// controllers/typeWorker.controller.js

const { TypeWorker } = require("../models");

// שליפת כל הרשומות
exports.getAllTypeWorkers = async (req, res) => {
    try {
        const workers = await TypeWorker.findAll();
        res.json(workers);
    } catch (error) {
        res.status(500).json({ error: "Error fetching TypeWorkers" });
    }
};

// הוספת רשומה חדשה
exports.addTypeWorker = async (req, res) => {
    try {
        const worker = await TypeWorker.create(req.body);
        res.status(201).json(worker);
    } catch (error) {
        res.status(500).json({ error: "Error adding TypeWorker" });
    }
};

// עדכון שם של רשומה
exports.updateTypeWorker = async (req, res) => {
    try {
        const { TW_code } = req.params;
        const { TW_name } = req.body;

        const worker = await TypeWorker.findByPk(TW_code);
        if (!worker) return res.status(404).json({ error: "Worker not found" });

        worker.TW_name = TW_name;
        await worker.save();

        res.json(worker);
    } catch (error) {
        res.status(500).json({ error: "Error updating TypeWorker" });
    }
};

// מחיקת רשומה
exports.deleteTypeWorker = async (req, res) => {
    try {
        const { TW_code } = req.params;
        const worker = await TypeWorker.findByPk(TW_code);
        if (!worker) return res.status(404).json({ error: "Worker not found" });

        await worker.destroy();
        res.json({ message: "Worker deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting TypeWorker" });
    }
};
