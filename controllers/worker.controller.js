const { Worker,MessageForCall, TypeGender, TypeWorker, SystemLogin, Task, Student, FileForWorker, CommonStudentForWorker, RecipientForMessage, Activity } = require('../models');

const { Op, Sequelize } = require('sequelize');

// שליפת כל העובדים 
exports.getAllWorkers = async (req, res) => {
    try {
        const { value, genderO, genderF, typeWO, typeWF } = req.query;

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
                w.Wo_Fname.toLowerCase().includes(searchValue) ||
                (w.Wo_name + " " + w.Wo_Fname).toLowerCase().includes(searchValue)

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

        //  console.log("Total workers after filtering:", listWorkers.length);


        res.json(listWorkers);
    } catch (error) {
        res.status(500).json({ error: "Error fetching workers" });
    }
}

// שליפת עובד לפי קוד 
exports.getWorkerOfCode = async (req, res) => {
    try {
        const { codeWoreker } = req.query;
        const code = Number(codeWoreker);
        if (isNaN(code)) {
            return res.status(400).json({ error: "Invalid code" });
        }
        const worker = await Worker.findOne({ where: { Wo_code: code } });
        if (!worker) {
            return res.status(404).json({ error: "worker not found" });
        }
        res.json(worker);
    } catch (error) {
        res.status(500).json({ error: "Error fetching parent" });
    }
};
// הוספת עובד חדש
exports.addWorker = async (req, res) => {
    try {
        const { Wo_code, ...data } = req.body; // מסיר את Wo_code כדי שה־AUTO_INCREMENT יפעל
        const worker = await Worker.create(data);
        res.status(201).json(worker);
    } catch (error) {
        console.log(error);
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
        console.log(error)
        res.status(500).json({ error: "Error updating worker" });
    }
};


exports.deleteWorker = async (req, res) => {
    const transaction = await Worker.sequelize.transaction();
    try {
        const { Wo_code } = req.params;

        const worker = await Worker.findByPk(Wo_code, { transaction });
        if (!worker) {
            await transaction.rollback();
            return res.status(404).json({ error: "Worker not found" });
        }
        // מחיקת פעילויות שהעובד ביצע
        let activity = await Activity.findOne({ where: { AFS_worker_code: Wo_code }, transaction });
        let message = await MessageForCall.findOne({ where: { MFC_sender_worker_code: Wo_code }, transaction });

        let student = await Student.findOne({ where: { St_worker_code: Wo_code }, transaction });
        if (activity || student|| message) {
       return res.json({ message: "לעובד זה משויכים חניכים/פעילויות/שיחות , לא ניתן למוחקו" });

        }
        else{
  // מחיקת משימות של העובד
        await Task.destroy({ where: { Ta_worker_code: Wo_code }, transaction });

        /*  // עדכון סטודנטים שהעובד היה מקושר אליהם (מניעת שגיאת FK)
         let St_worker_code = null
         let workerRecord = await Worker.findOne({ where: { Wo_name: "לא", Wo_Fname: "ידוע" } });
         if (workerRecord) {
             St_worker_code = workerRecord.Wo_code;
         }
         else {
              workerRecord = await Worker.create({ Wo_name: "לא", Wo_Fname: "ידוע", Wo_ID: "000000000", Wo_type_worker: 1, Wo_gender: 1, Wo_password: "0000" }, { transaction: transaction });
             if (workerRecord) {
                 St_worker_code = workerRecord.Wo_code;
             }
         }
         await Student.update({ St_worker_code: St_worker_code }, { where: { St_worker_code: Wo_code }, transaction });
  */
        // מחיקת קבצים של העובד
        await FileForWorker.destroy({ where: { FFW_worker_code: Wo_code }, transaction });

        // מחיקת חניכים משותפים של העובד
        await CommonStudentForWorker.destroy({ where: { CSFP_code_worker: Wo_code }, transaction });

        // מחיקת מקבל הודעה שהוא העובד
        await RecipientForMessage.destroy({ where: { RFM_worker_code: Wo_code }, transaction });

        // מחיקת העובד עצמו
        await worker.destroy({ transaction });

        await transaction.commit();
        res.json({ message: "העובד נמחק בהצלחה" });

        }
      
    } catch (error) {
        console.error(error);
        await transaction.rollback();
     //   res.status(500).json({ error: "Error deleting worker" });
                res.status(500).json({ error: "אירעה שגיאה במחיקת עובד" });

    }
};




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
                worker2.Wo_ID = "0000";
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


