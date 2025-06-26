// controllers/systemLogin.controller.js

const { SystemLogin } = require("../models");

// שליפת כל הרשומות
exports.getAllSystemLogins = async (req, res) => {
    try {
        const logins = await SystemLogin.findAll();
        res.json(logins);
    } catch (error) {
        res.status(500).json({ error: "Error fetching SystemLogins" });
    }
};
// שליפת הרשומה הראשונה בלבד
exports.getFirstSystemLogin = async (req, res) => {
    try {
        const login = await SystemLogin.findOne();
        if (!login) return res.status(404).json({ error: "No SystemLogin found" });

        res.json(login);
    } catch (error) {
        res.status(500).json({ error: "Error fetching first SystemLogin" });
    }
};

// הוספת רשומה חדשה
exports.addSystemLogin = async (req, res) => {
    try {
        const login = await SystemLogin.create(req.body);
        res.status(201).json(login);
    } catch (error) {
        res.status(500).json({ error: "Error adding SystemLogin" });
    }
};

// עדכון שם וסיסמא של רשומה
exports.updateSystemLogin = async (req, res) => {
    try {
        const { SL_code } = req.params;
        const { systemLogin } = req.body;

        const login = await SystemLogin.findByPk(SL_code);
        if (!login) return res.status(404).json({ error: "SystemLogin not found" });

        login.SL_name = systemLogin.SL_name;
        login.SL_password = systemLogin.SL_password;
        await login.save();
  const io = req.app.get("socketio");
            io.emit("systemLogin-updated"); // משדר לכל הלקוחות
        res.json(login);
    } catch (error) {
        res.status(500).json({ error: "Error updating SystemLogin" });
    }
};

// מחיקת רשומה
exports.deleteSystemLogin = async (req, res) => {
    try {
        const { SL_code } = req.params;
        const login = await SystemLogin.findByPk(SL_code);
        if (!login) return res.status(404).json({ error: "SystemLogin not found" });

        await login.destroy();
        res.json({ message: "SystemLogin deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting SystemLogin" });
    }
};
