const { Worker, Student, Activity, TypeOfActivity, CategoriesForActivity } = require('../models');
const { Op, fn, col, literal } = require("sequelize");
const { format, startOfMonth, startOfWeek, startOfDay, startOfYear,endOfMonth, subMonths  } = require("date-fns");

const { } = require("date-fns");

exports.getMatrixStats = async (req, res) => {
    try {
        const { codeFilter } = req.query;
        const FilterCode = Number(codeFilter);
        const now = new Date();
        const weekStart = startOfWeek(now, { weekStartsOn: 0 }); // ראשון
        let matrix = [
            [0, 0, 0, 0],      // שורה 0
            [0, 0, 0, 0, 0],   // שורה 1
            [0, 0, 0, 0, 0],   // שורה 2
            [0, 0, 0, 0, 0],   // שורה 3
            [0, 0, 0, 0, 0],   // שורה 4
            [0, 0, 0, 0, 0],   // שורה 5
            [0, 0, 0, 0, 0],   // שורה 6
            [0, 0, 0, 0, 0],   // שורה 7
            [0, 0]             // שורה 8
        ];

        // שורה 1
        matrix[0][0] = await Worker.count({ where: { Wo_type_worker: 1 } });
        matrix[0][1] = await Worker.count({ where: { Wo_type_worker: 2 } });
        matrix[0][2] = await Student.count({ where: { St_activity_status: 1 } });
        matrix[0][3] = await Student.count();

        // שורה 2 
        matrix[1][0] = await Activity.count({ where: { AFS_date: { [Op.gte]: weekStart } } });
        matrix[1][2] = await Activity.count({ where: { AFS_date: { [Op.gte]: weekStart } } });
        matrix[1][3] = await Activity.count({ where: { AFS_date: { [Op.gte]: weekStart } } });
        matrix[1][4] = await Activity.count({ where: { AFS_date: { [Op.gte]: weekStart } } });
        matrix[1][5] = await Activity.count({ where: { AFS_date: { [Op.gte]: weekStart } } });


        // פעילויות מהשבוע הנוכחי
        const weekActivitiesFilter = { AFS_date: { [Op.gte]: weekStart } };
        // 1. כמות כללית של פעילויות השבוע
        matrix[1][0] = await Activity.count({ where: weekActivitiesFilter });
        // 2. כמות פעילויות עם סוג פעילות "פגישה אישית"
        matrix[1][1] = await Activity.count({
            where: weekActivitiesFilter,
            include: [{
                model: CategoriesForActivity,
                required: true,
                include: [{
                    model: TypeOfActivity,
                    required: true,
                    where: { TOA_name: "פגישה אישית" }
                }]
            }]
        });

        // 3. סכום קילומטרים
        const kmSumResult = await Activity.findOne({
            attributes: [[fn("SUM", col("AFS_kilometer")), "sum"]],
            where: weekActivitiesFilter,
            raw: true
        });
        matrix[1][2] = kmSumResult.sum || 0;

        // 4. סכום זמן פעילות
        const timeSumResult = await Activity.findOne({
            attributes: [[fn("SUM", col("AFS_activity_time")), "sum"]],
            where: weekActivitiesFilter,
            raw: true
        });
        matrix[1][3] = timeSumResult.sum || 0;

        // 5. כמות פעילויות עם סוג פעילות "שיבוץ בישיבה"
        matrix[1][4] = await Activity.count({
            where: weekActivitiesFilter,
            include: [{
                model: CategoriesForActivity,
                required: true,
                include: [{
                    model: TypeOfActivity,
                    required: true,
                    where: { TOA_name: "שיבוץ בישיבה" }
                }]
            }]
        });

        // קביעת תאריך תחילת החודש הנוכחי בפורמט מתאים לשדה AFS_date
        const monthStart = format(startOfMonth(new Date()), "yyyy-MM-dd");

        const monthActivitiesFilter = {
            AFS_date: { [Op.gte]: monthStart }
        };

        // 1. כמות כללית של פעילויות החודש
        matrix[2][0] = await Activity.count({
            where: monthActivitiesFilter
        });

        // 2. כמות פעילויות עם סוג פעילות "פגישה אישית"
        matrix[2][1] = await Activity.count({
            where: monthActivitiesFilter,
            include: [{
                model: CategoriesForActivity,
                required: true,
                include: [{
                    model: TypeOfActivity,
                    required: true,
                    where: { TOA_name: "פגישה אישית" }
                }]
            }]
        });

        // 3. סכום קילומטרים בפעילויות החודש
        const monthKmSumResult = await Activity.findOne({
            attributes: [[fn("SUM", col("AFS_kilometer")), "sum"]],
            where: monthActivitiesFilter,
            raw: true
        });
        matrix[2][2] = monthKmSumResult.sum || 0;

        // 4. סכום זמן פעילות בפעילויות החודש
        const monthTimeSumResult = await Activity.findOne({
            attributes: [[fn("SUM", col("AFS_activity_time")), "sum"]],
            where: monthActivitiesFilter,
            raw: true
        });
        matrix[2][3] = monthTimeSumResult.sum || 0;

        // 5. כמות פעילויות עם סוג פעילות "שיבוץ בישיבה" החודש
        matrix[2][4] = await Activity.count({
            where: monthActivitiesFilter,
            include: [{
                model: CategoriesForActivity,
                required: true,
                include: [{
                    model: TypeOfActivity,
                    required: true,
                    where: { TOA_name: "שיבוץ בישיבה" }
                }]
            }]
        });

        // תאריך התחלה של השנה הנוכחית
        const yearStart = format(startOfYear(new Date()), "yyyy-MM-dd");

        const yearActivitiesFilter = {
            AFS_date: { [Op.gte]: yearStart }
        };

        // 1. כמות כללית של פעילויות השנה
        matrix[3][0] = await Activity.count({
            where: yearActivitiesFilter
        });

        // 2. כמות פעילויות עם סוג פעילות "פגישה אישית" השנה
        matrix[3][1] = await Activity.count({
            where: yearActivitiesFilter,
            include: [{
                model: CategoriesForActivity,
                required: true,
                include: [{
                    model: TypeOfActivity,
                    required: true,
                    where: { TOA_name: "פגישה אישית" }
                }]
            }]
        });

        // 3. סכום קילומטרים בפעילויות השנה
        const yearKmSumResult = await Activity.findOne({
            attributes: [[fn("SUM", col("AFS_kilometer")), "sum"]],
            where: yearActivitiesFilter,
            raw: true
        });
        matrix[3][2] = yearKmSumResult.sum || 0;

        // 4. סכום זמן פעילות בפעילויות השנה
        const yearTimeSumResult = await Activity.findOne({
            attributes: [[fn("SUM", col("AFS_activity_time")), "sum"]],
            where: yearActivitiesFilter,
            raw: true
        });
        matrix[3][3] = yearTimeSumResult.sum || 0;

        // 5. כמות פעילויות עם סוג פעילות "שיבוץ בישיבה" השנה
        matrix[3][4] = await Activity.count({
            where: yearActivitiesFilter,
            include: [{
                model: CategoriesForActivity,
                required: true,
                include: [{
                    model: TypeOfActivity,
                    required: true,
                    where: { TOA_name: "שיבוץ בישיבה" }
                }]
            }]
        });
// 1. כמות כללית של כל הפעילויות
matrix[4][0] = await Activity.count();

// 2. כמות פעילויות עם סוג פעילות "פגישה אישית"
matrix[4][1] = await Activity.count({
  include: [{
    model: CategoriesForActivity,
    required: true,
    include: [{
      model: TypeOfActivity,
      required: true,
      where: { TOA_name: "פגישה אישית" }
    }]
  }]
});

// 3. סכום AFS_kilometer בכלל הפעילויות
const totalKmSumResult = await Activity.findOne({
  attributes: [[fn("SUM", col("AFS_kilometer")), "sum"]],
  raw: true
});
matrix[4][2] = totalKmSumResult.sum || 0;

// 4. סכום AFS_activity_time בכלל הפעילויות
const totalTimeSumResult = await Activity.findOne({
  attributes: [[fn("SUM", col("AFS_activity_time")), "sum"]],
  raw: true
});
matrix[4][3] = totalTimeSumResult.sum || 0;

// 5. כמות פעילויות עם סוג פעילות "שיבוץ בישיבה"
matrix[4][4] = await Activity.count({
  include: [{
    model: CategoriesForActivity,
    required: true,
    include: [{
      model: TypeOfActivity,
      required: true,
      where: { TOA_name: "שיבוץ בישיבה" }
    }]
  }]
});

const thisMonthStart = startOfMonth(new Date());
const lastMonthStart = subMonths(thisMonthStart, 1);
const lastMonthEnd = endOfMonth(lastMonthStart);

// 1. שליפת ערכים של החודש הקודם
const prevMonth = [0, 0, 0, 0, 0];

// כמות פעילויות בחודש הקודם
prevMonth[0] = await Activity.count({
  where: { AFS_date: { [Op.between]: [lastMonthStart, lastMonthEnd] } }
});

// פגישה אישית בחודש הקודם
prevMonth[1] = await Activity.count({
  where: { AFS_date: { [Op.between]: [lastMonthStart, lastMonthEnd] } },
  include: [{
    model: CategoriesForActivity,
    required: true,
    include: [{
      model: TypeOfActivity,
      required: true,
      where: { TOA_name: "פגישה אישית" }
    }]
  }]
});

// סכום ק"מ בחודש הקודם
const kmRes = await Activity.findOne({
  attributes: [[fn("SUM", col("AFS_kilometer")), "sum"]],
  where: { AFS_date: { [Op.between]: [lastMonthStart, lastMonthEnd] } },
  raw: true
});
prevMonth[2] = kmRes.sum || 0;

// סכום זמן פעילות
const timeRes = await Activity.findOne({
  attributes: [[fn("SUM", col("AFS_activity_time")), "sum"]],
  where: { AFS_date: { [Op.between]: [lastMonthStart, lastMonthEnd] } },
  raw: true
});
prevMonth[3] = timeRes.sum || 0;

// שיבוץ בישיבה
prevMonth[4] = await Activity.count({
  where: { AFS_date: { [Op.between]: [lastMonthStart, lastMonthEnd] } },
  include: [{
    model: CategoriesForActivity,
    required: true,
    include: [{
      model: TypeOfActivity,
      required: true,
      where: { TOA_name: "שיבוץ בישיבה" }
    }]
  }]
});

// 2. חישוב אחוזים מול החודש הנוכחי (matrix[2])
matrix[5] = matrix[2].map((curr, i) => {
  const prev = prevMonth[i];
  if (prev === 0) return 0; // או אולי 100 אם רוצים להדגיש עלייה מ-0
  return ((curr - prev) / prev * 100).toFixed(1); // שמירה באחוזים עם ספרה אחת אחרי הנקודה
});

        res.json(matrix);

    } catch (error) {
        console.error('Error in getMatrixStats:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
