const { Worker, Student, Activity, TypeOfActivity, CategoriesForActivity } = require('../models');
const sequelize = require("../config/database"); // ייבוא נכון

const { Op, fn, col, literal } = require("sequelize");
const { format, startOfMonth, startOfWeek, startOfDay, startOfYear, endOfMonth, subMonths } = require("date-fns");
const { QueryTypes } = require("sequelize");
exports.getMatrixStats = async (req, res) => {
    try {
        const { codeFilter } = req.query;
        const FilterCode = Number(codeFilter);
        const now = new Date();
        const weekStart = startOfWeek(now, { weekStartsOn: 0 });
        const monthStart = format(startOfMonth(now), "yyyy-MM-dd");
        const yearStart = format(startOfYear(now), "yyyy-MM-dd");
        const thisMonthStart = startOfMonth(now);
        const lastMonthStart = subMonths(thisMonthStart, 1);
        const lastMonthEnd = endOfMonth(lastMonthStart);

        let matrix = Array.from({ length: 9 }, () => Array(5).fill(0));
        matrix[0].push(0); // שורה 0 עם 4 ערכים + 1 דמי

        let studentWhere = {};
        let workerWhere = {};
        let activityWhere = {};
        let commonInclude = [];

        if (FilterCode === -2) {
            studentWhere = { St_gender: 1 };
            workerWhere = { Wo_gender: 1 };
            commonInclude.push({
                model: Worker,
                required: true,
                where: { Wo_gender: 1 },
                attributes: []
            });
        } else if (FilterCode === -3) {
            studentWhere = { St_gender: 2 };
            workerWhere = { Wo_gender: 2 };
            commonInclude.push({
                model: Worker,
                required: true,
                where: { Wo_gender: 2 },
                attributes: []
            });
        } else if (FilterCode > 0) {
            activityWhere = { AFS_worker_code: FilterCode };
        }

        // שורה 0
        if (FilterCode === -1 || FilterCode === -2 || FilterCode === -3) {
            matrix[0][0] = await Worker.count({ where: { ...workerWhere, Wo_type_worker: 1 } });
            matrix[0][1] = await Worker.count({ where: { ...workerWhere, Wo_type_worker: 2 } });
        }

        if (FilterCode > 0) {
            matrix[0][2] = await Student.count({
                where: { St_activity_status: 1, St_worker_code: FilterCode }
            });
            matrix[0][3] = await Student.count({
                where: { St_worker_code: FilterCode }
            });
        } else {
            matrix[0][2] = await Student.count({ where: { ...studentWhere, St_activity_status: 1 } });
            matrix[0][3] = await Student.count({ where: studentWhere });
        }

        const fillActivityStats = async (rowIndex, extraWhere = {}) => {
            const where = { ...activityWhere, ...extraWhere };

            matrix[rowIndex][0] = await Activity.count({ where, include: commonInclude });

            matrix[rowIndex][1] = await Activity.count({
                where,
                include: [
                    ...commonInclude,
                    {
                        model: CategoriesForActivity,
                        required: true,
                        attributes: [],
                        include: [{
                            model: TypeOfActivity,
                            required: true,
                            attributes: [],
                            where: { TOA_name: "פגישה אישית" }
                        }]
                    }
                ]
            });

            const kmSum = await Activity.findOne({
                attributes: [[fn("SUM", col("AFS_kilometer")), "sum"]],
                where,
                include: commonInclude,
                raw: true
            });
            matrix[rowIndex][2] = kmSum?.sum || 0;

            const timeSum = await Activity.findOne({
                attributes: [[fn("SUM", col("AFS_activity_time")), "sum"]],
                where,
                include: commonInclude,
                raw: true
            });
            matrix[rowIndex][3] = timeSum?.sum || 0;

            matrix[rowIndex][4] = await Activity.count({
                where,
                include: [
                    ...commonInclude,
                    {
                        model: CategoriesForActivity,
                        required: true,
                        attributes: [],
                        include: [{
                            model: TypeOfActivity,
                            required: true,
                            attributes: [],
                            where: { TOA_name: "שיבוץ בישיבה" }
                        }]
                    }
                ]
            });
        };

        await fillActivityStats(1, { AFS_date: { [Op.gte]: weekStart } });
        await fillActivityStats(2, { AFS_date: { [Op.gte]: monthStart } });
        await fillActivityStats(3, { AFS_date: { [Op.gte]: yearStart } });
        await fillActivityStats(4);

        // שורה 5 – חודש קודם
        const prevMonth = [0, 0, 0, 0, 0];
        const prevWhere = { ...activityWhere, AFS_date: { [Op.between]: [lastMonthStart, lastMonthEnd] } };

        prevMonth[0] = await Activity.count({ where: prevWhere, include: commonInclude });

        prevMonth[1] = await Activity.count({
            where: prevWhere,
            include: [
                ...commonInclude,
                {
                    model: CategoriesForActivity,
                    required: true,
                    attributes: [],
                    include: [{
                        model: TypeOfActivity,
                        required: true,
                        attributes: [],
                        where: { TOA_name: "פגישה אישית" }
                    }]
                }
            ]
        });

        const kmRes = await Activity.findOne({
            attributes: [[fn("SUM", col("AFS_kilometer")), "sum"]],
            where: prevWhere,
            include: commonInclude,
            raw: true
        });
        prevMonth[2] = kmRes?.sum || 0;

        const timeRes = await Activity.findOne({
            attributes: [[fn("SUM", col("AFS_activity_time")), "sum"]],
            where: prevWhere,
            include: commonInclude,
            raw: true
        });
        prevMonth[3] = timeRes?.sum || 0;

        prevMonth[4] = await Activity.count({
            where: prevWhere,
            include: [
                ...commonInclude,
                {
                    model: CategoriesForActivity,
                    required: true,
                    attributes: [],
                    include: [{
                        model: TypeOfActivity,
                        required: true,
                        attributes: [],
                        where: { TOA_name: "שיבוץ בישיבה" }
                    }]
                }
            ]
        });

        matrix[5] = matrix[2].map((curr, i) => {
            const prev = prevMonth[i];
            if (prev === 0) return 0;
            return +(((curr - prev) / prev) * 100).toFixed(1);
        });

        // שורה 8 – דירוגים (רק אם קוד סינון > 0)
        // סה"כ זמן
        const weekWhere = { AFS_date: { [Op.gte]: weekStart } };

        const allTime = await Activity.findAll({
            attributes: ['AFS_worker_code', [fn('SUM', col('AFS_activity_time')), 'sum']],
            where: weekWhere,
            group: ['AFS_worker_code'],
            raw: true
        });

        if (FilterCode > 0) {

            // כלל הפעילויות
            const allCounts = await Activity.findAll({
                attributes: ['AFS_worker_code', [fn('COUNT', col('AFS_code')), 'count']],
                where: weekWhere,
                group: ['AFS_worker_code'],
                raw: true
            });

            // פגישה אישית
            const personalMeetings = await Activity.findAll({
                attributes: ['AFS_worker_code', [fn('COUNT', col('Activity.AFS_code')), 'countPersonal']],
                where: weekWhere,
                include: [{
                    model: CategoriesForActivity,
                    required: true,
                    attributes: [],
                    include: [{
                        model: TypeOfActivity,
                        required: true,
                        attributes: [],
                        where: { TOA_name: "פגישה אישית" }
                    }]
                }],
                group: ['AFS_worker_code'],
                raw: true
            });

            // סה"כ ק"מ
            const allKm = await Activity.findAll({
                attributes: ['AFS_worker_code', [fn('SUM', col('AFS_kilometer')), 'sum']],
                where: weekWhere,
                group: ['AFS_worker_code'],
                raw: true
            });



            // שיבוץ בישיבה
            const seatings = await Activity.findAll({
                attributes: ['AFS_worker_code', [fn('COUNT', col('Activity.AFS_code')), 'countSeating']],
                where: weekWhere,
                include: [{
                    model: CategoriesForActivity,
                    required: true,
                    attributes: [],
                    include: [{
                        model: TypeOfActivity,
                        required: true,
                        attributes: [],
                        where: { TOA_name: "שיבוץ בישיבה" }
                    }]
                }],
                group: ['AFS_worker_code'],
                raw: true
            });

            // דירוג לכל שדה
            const rankBy = (arr, key) => {
                const sorted = [...arr].sort((a, b) => b[key] - a[key]);
                const rankMap = new Map();
                sorted.forEach((item, index) => {
                    rankMap.set(item.AFS_worker_code, index + 1);
                });
                return rankMap;
            };

            matrix[7][0] = rankBy(allCounts, 'count').get(FilterCode) || 0;
            matrix[7][1] = rankBy(personalMeetings, 'countPersonal').get(FilterCode) || 0;
            matrix[7][2] = rankBy(allKm, 'sum').get(FilterCode) || 0;
            matrix[7][3] = rankBy(allTime, 'sum').get(FilterCode) || 0;
            matrix[7][4] = rankBy(seatings, 'countSeating').get(FilterCode) || 0;
        }
        // ערך 1: קוד הפעיל עם הזמן המצטבר הגבוה ביותר השבוע
        matrix[8][0] = (await getTopWorkerOfWeek());
       
        matrix[8][1] = (await getLastWorkerForSpecificType());

        res.json(matrix);

    } catch (error) {
        console.error("Error in getMatrixStats:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

async function getTopWorkerOfWeek() {
    // שלב 1: סכום זמן פעילות פר עובד-חניך לשבוע הנוכחי
    const rawResults = await sequelize.query(`
        SELECT 
            a.AFS_worker_code AS workerCode,
            sfa.SFA_code_student AS studentCode,
            SUM(a.AFS_activity_time) AS totalTime
        FROM 
            activity a
        JOIN 
            studentForActivity sfa ON a.AFS_code = sfa.SFA_code_activity
        WHERE 
            YEARWEEK(a.AFS_date, 1) = YEARWEEK(CURDATE(), 1)
        GROUP BY 
            a.AFS_worker_code, sfa.SFA_code_student
    `, { type: QueryTypes.SELECT });

    // שלב 2: לכל עובד – החניך עם הזמן הגבוה ביותר
    const maxTimePerWorker = {}; // { workerCode: maxTime }

    for (const row of rawResults) {
        const { workerCode, totalTime } = row;

        if (!maxTimePerWorker[workerCode] || totalTime > maxTimePerWorker[workerCode]) {
            maxTimePerWorker[workerCode] = totalTime;
        }
    }

    // שלב 3: מציאת העובד עם הזמן המקסימלי מכל העובדים
    let topWorker = null;
    let topTime = -1;

    for (const [workerCode, time] of Object.entries(maxTimePerWorker)) {
        if (time > topTime) {
            topTime = time;
            topWorker = workerCode;
        }
    }
    /*     return { workerCode: Number(topWorker), totalTime: topTime };
     */
    return Number(topWorker);;
}

async function getLastWorkerForSpecificType() {
    try {
        const result = await Activity.findOne({
            include: [
                {
                    model: CategoriesForActivity,
                    as: 'CategoriesForActivities', // שים לב לשם association לפי הגדרה בפועל אם שונה
                    include: [
                        {
                            model: TypeOfActivity,
                            where: {
                                TOA_name: "שיבוץ בישיבה"
                            }
                        }
                    ]
                }
            ],
            order: [["AFS_date", "DESC"]],
        });

        if (!result) return null;

        return result.AFS_worker_code;
    } catch (error) {
        console.error("Error in getLastWorkerForSpecificType:", error);
        throw error;
    }
}

