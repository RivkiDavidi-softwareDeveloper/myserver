// controllers/typeOfActivity.controller.js

const { TypeOfActivity } = require("../models");

// שליפת כל הרשומות
exports.getAllTypeOfActivities = async (req, res) => {
    try {
        const activities = await TypeOfActivity.findAll();
        res.json(activities);
    } catch (error) {
        res.status(500).json({ error: "Error fetching TypeOfActivities" });
    }
};

// הוספת רשומה חדשה
exports.addTypeOfActivity = async (req, res) => {
    try {
        const activity = await TypeOfActivity.create(req.body);
        res.status(201).json(activity);
    } catch (error) {
        res.status(500).json({ error: "Error adding TypeOfActivity" });
    }
};

// עדכון שם של רשומה
exports.updateTypeOfActivity = async (req, res) => {
    try {
        const { TOA_code } = req.params;
        const { TOA_name } = req.body;

        const activity = await TypeOfActivity.findByPk(TOA_code);
        if (!activity) return res.status(404).json({ error: "Activity not found" });

        activity.TOA_name = TOA_name;
        await activity.save();

        res.json(activity);
    } catch (error) {
        res.status(500).json({ error: "Error updating TypeOfActivity" });
    }
};

// מחיקת רשומה
exports.deleteTypeOfActivity = async (req, res) => {
    try {
        const { TOA_code } = req.params;
        const activity = await TypeOfActivity.findByPk(TOA_code);
        if (!activity) return res.status(404).json({ error: "Activity not found" });

        await activity.destroy();
        res.json({ message: "Activity deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting TypeOfActivity" });
    }
};
