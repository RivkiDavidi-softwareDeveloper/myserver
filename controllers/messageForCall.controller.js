// controllers/messageForCall.controller.js

const { MessageForCall } = require("../models");

// שליפת כל ההודעות
exports.getAllMessagesForCall = async (req, res) => {
    try {
        const messages = await MessageForCall.findAll();
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: "Error fetching messages" });
    }
};

// הוספת הודעה חדשה
exports.addMessageForCall = async (req, res) => {
    try {
        const message = await MessageForCall.create(req.body);
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: "Error adding message" });
    }
};

// עדכון הודעה
exports.updateMessageForCall = async (req, res) => {
    try {
        const { MFC_code } = req.params;
        const { MFC_content, MFC_date, MFC_time } = req.body;

        const message = await MessageForCall.findByPk(MFC_code);
        if (!message) return res.status(404).json({ error: "Message not found" });

        message.MFC_content = MFC_content;
        message.MFC_date = MFC_date;
        message.MFC_time = MFC_time;
        await message.save();

        res.json(message);
    } catch (error) {
        res.status(500).json({ error: "Error updating message" });
    }
};

// מחיקת הודעה
exports.deleteMessageForCall = async (req, res) => {
    try {
        const { MFC_code } = req.params;
        const message = await MessageForCall.findByPk(MFC_code);
        if (!message) return res.status(404).json({ error: "Message not found" });

        await message.destroy();
        res.json({ message: "Message deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting message" });
    }
};
