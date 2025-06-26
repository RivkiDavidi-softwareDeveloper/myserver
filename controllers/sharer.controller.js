const {Sharer, StudiesForSharer ,Parent} = require('../models');
const { clean } = require('../utils/cleaner');
/* const fs = require('fs');
const path = require('path');
const XLSX = require("xlsx");
const { Op, Sequelize, DATE } = require('sequelize'); */
//שליפץ הכל
exports.getAllSharers = async (req, res) => {
    try {
        const sharers = await Sharer.findAll();
        res.json(sharers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
//שליפה ע"י קוד
exports.getSharerById = async (req, res) => {
    try {
        const sharer = await Sharer.findByPk(req.params.id);
        if (!sharer) {
            return res.status(404).json({ error: 'Sharer not found' });
        }
            
        res.json(sharer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
//יצירה
exports.createSharer = async (req, res) => {
    try {
        const newSharer = await Sharer.create(req.body);
          const io = req.app.get("socketio");
        io.emit("sharers-updated"); // משדר לכל הלקוחות
        res.status(201).json(newSharer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// עדכון פרטי משתתף
exports.updateSharer = async (req, res) => {
    const [sharerDataRaw, parentFDataRaw, parentMDataRaw, studiesDataRaw] = req.body.data;
    const t = await Sharer.sequelize.transaction();
    try {
        const parentFData = clean(parentFDataRaw, ['Pa_code']);
        const parentMData = clean(parentMDataRaw, ['Pa_code']);
        const sharerData = clean(sharerDataRaw, ['Sh_code']);
        const studiesData = clean(studiesDataRaw, ['SFS_code']);

        const sharerCode = sharerDataRaw.Sh_code;

        // עדכון הורה אב
        await Parent.update(parentFData, {
            where: { Pa_code: parentFDataRaw.Pa_code },
            transaction: t
        });

        // עדכון הורה אם
        await Parent.update(parentMData, {
            where: { Pa_code: parentMDataRaw.Pa_code },
            transaction: t
        });

        // עדכון תלמיד
        await Sharer.update({
            ...sharerData,
            Sh_father_code: parentFDataRaw.Pa_code,
            Sh_mother_code: parentMDataRaw.Pa_code
        }, {
            where: { Sh_code: sharerCode },
            transaction: t
        });

        // עדכון או יצירת פרטי לימודים
        const existingStudies = await StudiesForSharer.findOne({
            where: { SFS_sharer_code: sharerCode },
            transaction: t
        });

        if (existingStudies) {
            await StudiesForSharer.update(studiesData, {
                where: { SFS_sharer_code: sharerCode },
                transaction: t
            });
        } else {
            await StudiesForSharer.create({
                ...studiesData,
                SFS_sharer_code: sharerCode
            }, { transaction: t });
        }

        await t.commit();
          const io = req.app.get("socketio");
        io.emit("sharers-updated"); // משדר לכל הלקוחות
        res.status(200).json({ message: "המשתתף עודכן בהצלחה" });

    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({ error: "שגיאה בעדכון משתתף" });
    }
};
//מחיקה
exports.deleteSharer = async (req, res) => {
    try {
        const sharer = await Sharer.findByPk(req.params.id);
        if (!sharer) {
            return res.status(404).json({ error: 'Sharer not found' });
        }
        await sharer.destroy();
          const io = req.app.get("socketio");
        io.emit("sharers-updated"); // משדר לכל הלקוחות
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
