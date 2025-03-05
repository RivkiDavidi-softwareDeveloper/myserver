// controllers/fileForMessage.controller.js

const { FileForMessage } = require("../models");

// שליפת כל הקבצים הקשורים להודעות
exports.getAllFilesForMessage = async (req, res) => {
    try {
        const files = await FileForMessage.findAll();
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: "Error fetching files for message" });
    }
};

// הוספת קובץ חדש להודעה
exports.addFileForMessage = async (req, res) => {
    try {
        const file = await FileForMessage.create(req.body);
        res.status(201).json(file);
    } catch (error) {
        res.status(500).json({ error: "Error adding file for message" });
    }
};

// עדכון פרטי קובץ
exports.updateFileForMessage = async (req, res) => {
    try {
        const { FFM_code } = req.params;
        const { FFM_name, FFM_link_to_file } = req.body;

        const file = await FileForMessage.findByPk(FFM_code);
        if (!file) return res.status(404).json({ error: "File not found" });

        file.FFM_name = FFM_name;
        file.FFM_link_to_file = FFM_link_to_file;
        await file.save();

        res.json(file);
    } catch (error) {
        res.status(500).json({ error: "Error updating file for message" });
    }
};

// מחיקת קובץ להודעה
exports.deleteFileForMessage = async (req, res) => {
    try {
        const { FFM_code } = req.params;
        const file = await FileForMessage.findByPk(FFM_code);
        if (!file) return res.status(404).json({ error: "File not found" });

        await file.destroy();
        res.json({ message: "File deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting file" });
    }
};
