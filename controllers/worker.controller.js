const { Worker, TypeGender, TypeWorker, SystemLogin } = require("../models");

// שליפת כל העובדים 
exports.getAllWorkers = async (req, res) => {
    try {
        const {value, genderO, genderF, typeWO, typeWF } = req.query;

        const genderOrder = Number(genderO);
        const genderFilter = Number(genderF);
        const typeWOrder = Number(typeWO);
        const typeWFilter = Number(typeWF);

        const searchValue = value ? value.toLowerCase() : null;

        let listWorkers = await Worker.findAll();

        // סינון לפי מגדר
        if (genderFilter !== 0) {
            listWorkers = listWorkers.filter(w => w.Wo_gender === genderFilter);
        }

        // סינון לפי סוג עובד
        if (typeWFilter !== 0) {
            listWorkers = listWorkers.filter(w => w.Wo_type_worker === typeWFilter);
        }

        // סינון לפי טקסט
        if (searchValue) {
            listWorkers = listWorkers.filter(w => 
                w.Wo_name.toLowerCase().includes(searchValue) ||
                w.Wo_Fname.toLowerCase().includes(searchValue) 
            );
        }

        // סידור הרשימה
        listWorkers.sort((a, b) => {
            let result = 0;
            if (genderOrder === 1) {
                result = a.Wo_gender - b.Wo_gender;
            }
            if (result === 0 && typeWOrder === 1) {
                result = a.Wo_type_worker - b.Wo_type_worker;
            }
            if (result === 0) {
                result = a.Wo_name.localeCompare(b.Wo_name);
            }
            return result;
        });

        console.log("Total workers after filtering:", listWorkers.length);


        res.json(listWorkers);
    } catch (error) {
        res.status(500).json({ error: "Error fetching workers" });
    }
}

// שליפת עובד לפי קוד עם מידע על מגדר וסוג עובד
exports.getWorkerById = async (req, res) => {
    try {
        const { Wo_code } = req.params;
        const worker = await Worker.findByPk(Wo_code);
        if (!worker) return res.status(404).json({ error: "Worker not found" });

        res.json(worker);
    } catch (error) {
        res.status(500).json({ error: "Error fetching worker" });
    }
};

// הוספת עובד חדש
exports.addWorker = async (req, res) => {
    try {
        const worker = await Worker.create(req.body);
        res.status(201).json(worker);
    } catch (error) {
        res.status(500).json({ error: "Error adding worker" });
    }
};

// עדכון פרטי עובד
exports.updateWorker = async (req, res) => {
    try {
        const { Wo_code } = req.params;
        const { Wo_ID, Wo_gender, Wo_type_worker, Wo_name, Wo_Fname, Wo_password, Wo_cell_phone, Wo_email } = req.body;

        const worker = await Worker.findByPk(Wo_code);
        if (!worker) return res.status(404).json({ error: "Worker not found" });

        // עדכון נתוני העובד
        worker.Wo_ID = Wo_ID;
        worker.Wo_gender = Wo_gender;
        worker.Wo_type_worker = Wo_type_worker;
        worker.Wo_name = Wo_name;
        worker.Wo_Fname = Wo_Fname;
        worker.Wo_password = Wo_password;
        worker.Wo_cell_phone = Wo_cell_phone;
        worker.Wo_email = Wo_email;

        await worker.save();

        // שליפה מחדש כולל הנתונים של המגדר וסוג העובד
        const updatedWorker = await Worker.findByPk(Wo_code);

        res.json(updatedWorker);
    } catch (error) {
        res.status(500).json({ error: "Error updating worker" });
    }
};

// מחיקת עובד
exports.deleteWorker = async (req, res) => {
    try {
        const { Wo_code } = req.params;
        const worker = await Worker.findByPk(Wo_code);
        if (!worker) return res.status(404).json({ error: "Worker not found" });

        await worker.destroy();
        res.json({ message: "Worker deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting worker" });
    }
};


const { Op, Sequelize } = require('sequelize');

// פעולה לקבלת עובד לפי שם מלא וסיסמא
exports.getWorkerByNameAndPassword = async (req, res) => {
    try {
        const { name, password } = req.body; // מקבלים את השם והסיסמא מה-Request

        // חיפוש עובד לפי שם מלא (שילוב Wo_name ו-Wo_Fname) וסיסמא
        const worker = await Worker.findOne({
            where: {
                [Op.and]: [{
                    [Op.or]: [
                        Sequelize.where(
                            Sequelize.fn('concat', Sequelize.col('Wo_name'), ' ', Sequelize.col('Wo_Fname')),
                            name // השוואת שם מלא
                        ),
                        Sequelize.where(
                            Sequelize.fn('concat', Sequelize.col('Wo_name'), '  ', Sequelize.col('Wo_Fname')),
                            name // השוואת שם מלא
                        ),
                        Sequelize.where(
                            Sequelize.fn('concat', Sequelize.col('Wo_name'), ' ', Sequelize.col('Wo_Fname'), ' '),
                            name // השוואת שם מלא
                        ),
                        Sequelize.where(
                            Sequelize.fn('concat', ' ', Sequelize.col('Wo_name'), ' ', Sequelize.col('Wo_Fname')),
                            name // השוואת שם מלא
                        ),
                        Sequelize.where(
                            Sequelize.fn('concat', Sequelize.col('Wo_name'), ' ', Sequelize.col('Wo_Fname')),
                            name // השוואת שם מלא
                        )
                    ]
                }
                    ,
                { Wo_password: password } // השוואת סיסמא
                ]
            }
        });

        // אם לא נמצא עובד, מחזירים הודעת שגיאה
        if (worker)
            res.json(worker);
        else {
            const systemLogin = await SystemLogin.findOne({
                where: {
                    [Op.and]: [
                        { SL_name: name },
                        { SL_password: password } // השוואת סיסמא
                    ]
                }
            });
            if (systemLogin) {
                const worker2 = new Worker();
                worker2.Wo_name = systemLogin.SL_name;
                worker2.Wo_password = systemLogin.SL_password;
                worker2.Wo_ID = "111111111";
                res.json(worker2);
            }
            else {
                return res.status(404).json({ error: "Worker not found" });
            }
        }
    } catch (error) {
        res.status(500).json({ error: "Error fetching worker by name and password" });
    }
};


