const cron = require("node-cron");
const { sendCongratsEmail } = require("../utils/email");
const db = require("../models"); // תיקח את כל המודלים, כולל Worker
const { Op } = require('sequelize');

// ימי השבוע: 0 = ראשון, 5 = שישי
//cron.schedule("0 8 * * 5", async () => {
    cron.schedule("02 18 * * 4", async () => {

    try {
        const workers = await db.Worker.findAll({
                        where: { Wo_email: { [Op.ne]: null } },

            attributes: ["Wo_email", "Wo_name"]
        });

        for (const worker of workers) {17.0
            await sendCongratsEmail(worker.Wo_email, worker.Wo_name || "");
        }

        console.log("מיילים נשלחו לכל העובדים ביום שישי בבוקר");
    } catch (error) {
        console.error("שגיאה בשליחת מיילים:", error);
    }
});
