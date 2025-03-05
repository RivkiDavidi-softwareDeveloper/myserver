// controllers/typeTask.controller.js

const { TypeTask } = require("../models");

// שליפת כל הרשומות
exports.getAllTypeTasks = async (req, res) => {
    try {
        const tasks = await TypeTask.findAll();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: "Error fetching TypeTasks" });
    }
};

// הוספת רשומה חדשה
exports.addTypeTask = async (req, res) => {
    try {
        const task = await TypeTask.create(req.body);
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: "Error adding TypeTask" });
    }
};

// עדכון שם של רשומה
exports.updateTypeTask = async (req, res) => {
    try {
        const { TT_code } = req.params;
        const { TT_name } = req.body;

        const task = await TypeTask.findByPk(TT_code);
        if (!task) return res.status(404).json({ error: "Task not found" });

        task.TT_name = TT_name;
        await task.save();

        res.json(task);
    } catch (error) {
        res.status(500).json({ error: "Error updating TypeTask" });
    }
};

// מחיקת רשומה
exports.deleteTypeTask = async (req, res) => {
    try {
        const { TT_code } = req.params;
        const task = await TypeTask.findByPk(TT_code);
        if (!task) return res.status(404).json({ error: "Task not found" });

        await task.destroy();
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting TypeTask" });
    }
};
