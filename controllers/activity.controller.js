const { Activity } = require("../models");
const { Worker } = require("../models");
const { StudentForActivity } = require("../models");
const { Student } = require("../models");
const { CategoriesForActivity } = require("../models");


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
                    () => dateA.getTime() - dateB.getTime(),
                    () => studentA.localeCompare(studentB)
                ];
            } else if (genderOrder === 1) {
                compareOrder = [
                    () => dateA.getTime() - dateB.getTime(),
                    () => workerA.localeCompare(workerB),
                    () => studentA.localeCompare(studentB)
                ];
            } else {
                compareOrder = [
                    () => studentA.localeCompare(studentB),
                    () => dateA.getTime() - dateB.getTime(),
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


exports.createActivity = async (req, res) => {
    try {
        const newActivity = await Activity.create(req.body);
        res.status(201).json(newActivity);
    } catch (error) {
        res.status(500).json({ error: "Error creating activity" });
    }
};

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

exports.deleteActivity = async (req, res) => {
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
};
