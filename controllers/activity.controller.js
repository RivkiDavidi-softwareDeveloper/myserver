const { Activity, Worker, StudentForActivity, Student, CategoriesForActivity } = require("../models");
const { clean } = require('../utils/cleaner');
const { Op, fn, col, literal } = require("sequelize");

//שליפת כל הפעילויות לפי סינונים
exports.getAllActivities = async (req, res) => {
    try {

        const { nameWorker, nameStudent, order, genderF, workerF, studentF, monthF, yearF, categoryF } = req.query;
        ;

        const genderOrder = Number(order);
        const genderFilter = Number(genderF);
        const workerFilter = Number(workerF);
        const studentFilter = Number(studentF);
        const monthFilter = Number(monthF);
        const yearFilter = Number(yearF);
        const categoryFilter = Number(categoryF);


        const searchNameWorker = nameWorker ? nameWorker.toLowerCase() : null;
        const searchNameStudent = nameStudent ? nameStudent.toLowerCase() : null;

        let activities = await Activity.findAll({
            include: [
                {
                    model: Worker,
                    attributes: ["Wo_code", "Wo_name", "Wo_Fname", "Wo_gender"]
                },
                {
                    model: StudentForActivity,
                    include: [
                        {
                            model: Student,
                            attributes: ["St_name", "St_Fname"]
                        }
                    ]
                },
                {
                    model: CategoriesForActivity
                }
            ]
        });


        // סינון לפי מגדר
        if (genderFilter !== 0) {
            activities = activities.filter(activity =>
                activity.Worker && activity.Worker.Wo_gender === genderFilter
            );
        }

        // סינון לפי עובד
        if (workerFilter !== -1) {
            activities = activities.filter(activity =>
                activity.AFS_worker_code === workerFilter
            );
        }
        // סינון לפי חניך
        if (studentFilter !== -1) {
            activities = activities.filter(activity =>
                activity.StudentForActivities &&
                activity.StudentForActivities.some(sfa => sfa.SFA_code_student === studentFilter)
            );
        }
        //סינון לפי שנה
        if (yearFilter != 0) {
            activities = activities.filter(activity => {
                const dateStr = activity.AFS_date;
                if (!dateStr || typeof dateStr !== 'string' || dateStr.length !== 10 || dateStr[4] !== '-' || dateStr[7] !== '-') {
                    console.warn(`Invalid date format: ${dateStr}`);
                    return false;
                }

                const year = parseInt(dateStr.substring(0, 4), 10);
                if (isNaN(year)) {
                    console.warn(`Year parsing failed: ${dateStr}`);
                    return false;
                }

                return year === yearFilter;
            });
        }
        //סינון לפי חודש
        if (monthFilter != 0) {
            activities = activities.filter(activity => {
                const dateStr = activity.AFS_date;
                const month = parseInt(dateStr.substring(5, 7), 10);
                if (isNaN(month)) {
                    console.warn(`Month parsing failed: ${dateStr}`);
                    return false;
                }

                return month === monthFilter;
            });

        }
        //סינון לפי קטגוריה
        if (categoryFilter != 0) {

            activities = activities.filter(activity =>
                activity.CategoriesForActivities?.some(c => c.CFA_code_type_activity === categoryFilter)
            );
        }
        // סינון לפי שם פעיל
        if (searchNameWorker) {
            // סינון לפי הופעה בשם פרטי או משפחה (לא תלוי רישיות)
            activities = activities.filter(activity => {
                if (!activity.Worker) return false;
                const fullName = `${activity.Worker.Wo_name || ""} ${activity.Worker.Wo_Fname || ""}`.toLowerCase();
                return fullName.includes(searchNameWorker.toLowerCase());
            });
        }
        //סינון לפי שם חניך
        if (searchNameStudent) {
            activities = activities.filter(activity => {
                return activity.StudentForActivities.some(sfa => {
                    const student = sfa.Student;
                    if (!student) return false;

                    const fullName = `${student.St_name || ""} ${student.St_Fname || ""}`.toLowerCase();
                    return fullName.includes(searchNameStudent.toLowerCase());
                });
            });
        }
        //מיון
        activities = activities.sort((a, b) => {
            const workerA = `${a.Worker?.Wo_Fname || ''} ${a.Worker?.Wo_name || ''}`.toLowerCase();
            const workerB = `${b.Worker?.Wo_Fname || ''} ${b.Worker?.Wo_name || ''}`.toLowerCase();

            const dateA = new Date(a.AFS_date);
            const dateB = new Date(b.AFS_date);

            const studentA = `${a.StudentForActivity?.Student?.St_Fname || ''} ${a.StudentForActivity?.Student?.St_name || ''}`.toLowerCase();
            const studentB = `${b.StudentForActivity?.Student?.St_Fname || ''} ${b.StudentForActivity?.Student?.St_name || ''}`.toLowerCase();

            let compareOrder;
            if (genderOrder === 0) {
                compareOrder = [
                    () => workerA.localeCompare(workerB),
                    () => dateB.getTime() - dateA.getTime(),
                    () => studentA.localeCompare(studentB)
                ];
            } else if (genderOrder === 1) {
                compareOrder = [
                    () => dateB.getTime() - dateA.getTime(),
                    () => workerA.localeCompare(workerB),
                    () => studentA.localeCompare(studentB)
                ];
            } else {
                compareOrder = [
                    () => studentA.localeCompare(studentB),
                    () => dateB.getTime() - dateA.getTime(),
                    () => workerA.localeCompare(workerB)
                ];
            }

            for (const compare of compareOrder) {
                const result = compare();
                if (result !== 0) return result;
            }
            return 0;
        });





        res.json(activities);
    } catch (error) {
        console.error(error); // הדפסת השגיאה המלאה

        res.status(500).json({ error: "Error fetching activities" });
    }
};
//שליפת תאריך הפעילות האחרונה לפי קוד חניך
exports.getLastActivityDateForStudent = async (req, res) => {
    const { studentCode } = req.params;

    try {
        const lastActivity = await Activity.findOne({
            include: [{
                model: StudentForActivity,
                where: { SFA_code_student: studentCode },
                attributes: []
            }],
            order: [['AFS_date', 'DESC']], // מיון יורד לפי מחרוזת בפורמט YYYY-MM-DD
            attributes: ['AFS_date']
        });

        if (!lastActivity) {
            return res.status(200).json('');
        }
        return res.status(200).json(lastActivity.AFS_date);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message });
    }
};



//הוספת פעילות
exports.addActivity = async (req, res) => {
    const { StudentForActivities, CategoriesForActivities, ...activityData } = req.body;
    const t = await Activity.sequelize.transaction();

    try {
        const cleanActivityData = clean(activityData, ['AFS_code']);
        const StudentForActivitiesData = StudentForActivities.map(d => clean(d, ['SFA_code']));
        const CategoriesForActivitiesData = CategoriesForActivities.map(d => clean(d, ['CFA_code']));
        //הוספת פעילות
        const newActivity = await Activity.create(cleanActivityData, { transaction: t });
        const AFS_code = newActivity.AFS_code;
        //הוספת חניכים לפעילות
        if (StudentForActivitiesData.length > 0) {
            const sfad = StudentForActivitiesData.map(d => ({
                ...d,
                SFA_code_activity: AFS_code
            }));
            await StudentForActivity.bulkCreate(sfad, { transaction: t });
        }
        //הוספת קטגוריות לפעילות
        if (CategoriesForActivitiesData.length > 0) {
            const sfad = CategoriesForActivitiesData.map(d => ({
                ...d,
                CFA_code_activity: AFS_code
            }));
            await CategoriesForActivity.bulkCreate(sfad, { transaction: t });
        }

        await t.commit();
   /*      const io = req.app.get("socketio");
        io.emit("activities-updated"); // משדר לכל הלקוחות */

        return res.status(201).json({ message: "הפעילות נוספה בהצלחה", AFS_code });
    } catch (error) {
        console.log(error)

        await t.rollback();
        return res.status(500).json({ error: error.message });
    }
};

/* exports.addActivity = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const {
            StudentForActivities,
            CategoriesForActivities,
            ...activityData
        } = req.body;
 
        const cleanActivityData = clean(activityData, ['AFS_code']);
 
        // יצירת פעילות חדשה בתוך טרנזקציה
        const newActivity = await Activity.create(cleanActivityData, { transaction: t });
        const AFS_code = newActivity.AFS_code;
 
        // הוספת חניכים
        if (Array.isArray(StudentForActivities)) {
            const studentRecords = StudentForActivities.map(s =>
                clean({
                    SFA_code_activity: AFS_code,
                    ...s
                }, ['SFA_code'])
            );
            await StudentForActivity.bulkCreate(studentRecords, { transaction: t });
        }
 
        // הוספת קטגוריות
        if (Array.isArray(CategoriesForActivities)) {
            const categoryRecords = CategoriesForActivities.map(c =>
                clean({
                    CFA_code_activity: AFS_code,
                    ...c
                }, ['CFA_code'])
            );
            await CategoriesForActivity.bulkCreate(categoryRecords, { transaction: t });
        }
 
        // אישור הטרנזקציה
        await t.commit();
        return res.status(201).json({ message: "הפעילות נוספה בהצלחה", AFS_code });
    } catch (error) {
        // ביטול כל השינויים במידה ונכשלת אחת הפעולות
        await t.rollback();
        console.log(error)
        return res.status(500).json({ error: error.message });
    }
};
 */

exports.updateActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Activity.update(req.body, {
            where: { AFS_code: id }
        });
        if (!updated) {
            return res.status(404).json({ error: "Activity not found" });
        }
        const updatedActivity = await Activity.findByPk(id);
        res.json(updatedActivity);
    } catch (error) {
        res.status(500).json({ error: "Error updating activity" });
    }
};
//מחיקת כל הפעילויות
exports.deleteActivities = async (req, res) => {
    try {
        await CategoriesForActivity.destroy({ where: {} });
        await StudentForActivity.destroy({ where: {} });
        await Activity.destroy({ where: {} });
        res.status(204).end();
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error deleting activity" });
    }
};
/* exports.deleteActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Activity.destroy({
            where: { AFS_code: id }
        });
        if (!deleted) {
            return res.status(404).json({ error: "Activity not found" });
        }
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: "Error deleting activity" });
    }
}; */
