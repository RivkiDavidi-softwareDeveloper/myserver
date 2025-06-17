const { Task, Worker } = require("../models");

// שליפת כל המשימות עם פרטי העובד המשויך
exports.getAllTasks = async (req, res) => {
    try {
        const { workerCode, amountDisplay } = req.query;
        const code = Number(workerCode);
        const amount = Number(amountDisplay);

        // שליפת משימות עם אפשרות סינון לפי עובד, וסידור יורד לפי מזהה (בהנחה שזה שדה אינקרמנטלי)
        const whereClause = code !== -1 ? { Ta_worker_code: code } : {};

        let tasks = await Task.findAll({
            where: whereClause,
            order: [
                ['Ta_date', 'DESC'],
                ['Ta_time', 'DESC']
            ],
            limit: amount // הגבלת מספר התוצאות
        });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: "Error fetching tasks" });
    }
};

// שליפת כמות המשימות שלא התבצעו עבור קוד עובד
exports.getAmoumtTasksNotDoneForWorker = async (req, res) => {
    try {
        const { workerCode } = req.query;
        const code = Number(workerCode);
        let tasks = await Task.findAll();
        // סינון לפי עובד
        if (code !== -1) {
            tasks = tasks.filter(t =>
                t.Ta_worker_code === code && t.Ta_done === 0
            );
        }
        res.json(tasks.length);
    } catch (error) {
        res.status(500).json({ error: "Error fetching tasks" });
    }
};

// שליפת משימה לפי קוד עם פרטי העובד המשויך
exports.getTaskById = async (req, res) => {
    try {
        const { Ta_code } = req.params;
        const task = await Task.findByPk(Ta_code, {
            include: [
                { model: Worker } // מחזיר את כל השדות של העובד
            ]
        });
        if (!task) return res.status(404).json({ error: "Task not found" });

        res.json(task);
    } catch (error) {
        res.status(500).json({ error: "Error fetching task" });
    }
};

// הוספת משימה חדשה
exports.addTask = async (req, res) => {
    try {
        const { Ta_code, ...data } = req.body;
        const task = await Task.create(data);
        res.status(201).json(task);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error adding task" });
    }
};

// עדכון משימה
exports.updateTask = async (req, res) => {
    try {
        const { Ta_code } = req.params;
        const { Ta_worker_code, Ta_description, Ta_date, Ta_time, Ta_done } = req.body;

        const task = await Task.findByPk(Ta_code);
        if (!task) return res.status(404).json({ error: "Task not found" });

        // עדכון נתוני המשימה
        task.Ta_worker_code = Ta_worker_code;
        task.Ta_description = Ta_description;
        task.Ta_date = Ta_date;
        task.Ta_time = Ta_time;
        task.Ta_done = Ta_done;

        await task.save();

        // שליפה מחדש כולל המידע על העובד
        const updatedTask = await Task.findByPk(Ta_code, {
            include: [
                { model: Worker } // מחזיר את כל השדות של העובד
            ]
        });

        res.json(updatedTask);
    } catch (error) {
        console.log(error);

        res.status(500).json({ error: "Error updating task" });
    }
};

// מחיקת משימה
exports.deleteTask = async (req, res) => {
    try {
        const { Ta_code } = req.params;
        const task = await Task.findByPk(Ta_code);
        if (!task) return res.status(404).json({ error: "Task not found" });

        await task.destroy();
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting task" });
    }
};
