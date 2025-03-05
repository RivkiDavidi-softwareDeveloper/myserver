// controllers/fileForWorker.controller.js

const { FileForWorker } = require("../models");

// שליפת כל הקבצים הקשורים לעובדים
exports.getAllFilesForWorker = async (req, res) => {
    try {
        const files = await FileForWorker.findAll();
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: "Error fetching files for worker" });
    }
};

// הוספת קובץ חדש לעובד
exports.addFileForWorker = async (req, res) => {
    try {
        const file = await FileForWorker.create(req.body);
        res.status(201).json(file);
    } catch (error) {
        res.status(500).json({ error: "Error adding file for worker" });
    }
};

// עדכון פרטי קובץ
exports.updateFileForWorker = async (req, res) => {
    try {
        const { FFW_code } = req.params;
        const { FFW_name, FFW_link_to_file } = req.body;

        const file = await FileForWorker.findByPk(FFW_code);
        if (!file) return res.status(404).json({ error: "File not found" });

        file.FFW_name = FFW_name;
        file.FFW_link_to_file = FFW_link_to_file;
        await file.save();

        res.json(file);
    } catch (error) {
        res.status(500).json({ error: "Error updating file for worker" });
    }
};

// מחיקת קובץ לעובד
exports.deleteFileForWorker = async (req, res) => {
    try {
        const { FFW_code } = req.params;
        const file = await FileForWorker.findByPk(FFW_code);
        if (!file) return res.status(404).json({ error: "File not found" });

        await file.destroy();
        res.json({ message: "File deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting file" });
    }
};
