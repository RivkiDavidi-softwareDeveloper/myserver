const { SubcategoryForTypeActivity } = require("../models");

// יצירת תת־קטגוריה חדשה
exports.addSubcategoryForTypeActivity = async (req, res) => {
    try {
        const { SFTA_code, ...data } = req.body;
        const subcategoryForTypeActivity = await SubcategoryForTypeActivity.create(data);
        res.status(201).json(subcategoryForTypeActivity);
       
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// שליפת כל תת־הקטגוריות
exports.findAll = async (req, res) => {
    try {
        const data = await SubcategoryForTypeActivity.findAll();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// שליפת כל התתי קטגוריות לפי קוד קטגוריה
exports.getSubcategoryOfCategory = async (req, res) => {
    try {
        const { codeCategory } = req.query;
        const code = Number(codeCategory);
        if (isNaN(code)) {
            return res.status(400).json({ error: "קוד שגוי" });
        }
        const data = await SubcategoryForTypeActivity.findAll({
            where: { SFTA_code_type_activity: code }

        });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "שגיאה בשליפת תתי קטגוריות" });
    }
};
// עדכון תת־קטגוריה
exports.update = async (req, res) => {
    try {
        const updated = await SubcategoryForTypeActivity.update(req.body, {
            where: { SFTA_code: req.params.id }
        });
        if (updated[0] === 0) {
            return res.status(404).json({ error: "Not found or no changes" });
        }
        res.status(200).json({ message: "Updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// מחיקת תת־קטגוריה
exports.delete = async (req, res) => {
    try {
        const deleted = await SubcategoryForTypeActivity.destroy({
            where: { SFTA_code: req.params.id }
        });
        if (deleted === 0) {
            return res.status(404).json({ error: "Not found" });
        }
        res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
