// controllers/recipientForMessage.controller.js

const { RecipientForMessage } = require("../models");

// שליפת כל המידע על מקבלי הודעות
exports.getAllRecipientsForMessage = async (req, res) => {
    try {
        const recipients = await RecipientForMessage.findAll();
        res.json(recipients);
    } catch (error) {
        res.status(500).json({ error: "Error fetching recipients for message" });
    }
};

// הוספת מקבל הודעה חדשה
exports.addRecipientForMessage = async (req, res) => {
    try {
        const recipient = await RecipientForMessage.create(req.body);
        res.status(201).json(recipient);
    } catch (error) {
        res.status(500).json({ error: "Error adding recipient for message" });
    }
};

// עדכון מצב מקבל הודעה
exports.updateRecipientForMessage = async (req, res) => {
    try {
        const { RFM_code } = req.params;
        const { RFM_done } = req.body;

        const recipient = await RecipientForMessage.findByPk(RFM_code);
        if (!recipient) return res.status(404).json({ error: "Recipient not found" });

        recipient.RFM_done = RFM_done;
        await recipient.save();

        res.json(recipient);
    } catch (error) {
        res.status(500).json({ error: "Error updating recipient for message" });
    }
};

// מחיקת מקבל הודעה
exports.deleteRecipientForMessage = async (req, res) => {
    try {
        const { RFM_code } = req.params;
        const recipient = await RecipientForMessage.findByPk(RFM_code);
        if (!recipient) return res.status(404).json({ error: "Recipient not found" });

        await recipient.destroy();
        res.json({ message: "Recipient deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting recipient" });
    }
};
