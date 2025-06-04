const { StudiesForStudent,Student } = require("../models");
const classUpgradeMap = {
    'כיתה א': 'כיתה ב',
    'כיתה ב': 'כיתה ג',
    'כיתה ג': 'כיתה ד',
    'כיתה ד': 'כיתה ה',
    'כיתה ה': 'כיתה ו',
    'כיתה ו': 'כיתה ז',
    'כיתה ז': 'כיתה ח',
    'כיתה ח': 'שיעור א',
    'שיעור א': 'שיעור ב',
    'שיעור ב': 'שיעור ג',
    'שיעור ג': 'שיעור א י.גדולה',
    'שיעור א י.גדולה': 'שיעור ב י.גדולה',
    'שיעור ב י.גדולה': 'שיעור ג י.גדולה',
    'שיעור ג י.גדולה' : 'קיבוץ'

};

const classUpgradeMap2 = {
    'כיתה א': 'כיתה ב',
    'כיתה ב': 'כיתה ג',
    'כיתה ג': 'כיתה ד',
    'כיתה ד': 'כיתה ה',
    'כיתה ה': 'כיתה ו',
    'כיתה ו': 'כיתה ז',
    'כיתה ז': 'כיתה ח',
    'כיתה ח': 'כיתה ט',
    'כיתה ט': 'כיתה י',
    'כיתה י': 'כיתה יא',
    'כיתה יא': 'כיתה יב',
    'כיתה יב': 'כיתה יג',
    'כיתה יג': 'כיתה יד',
    'כיתה יד': 'סיימה לימודים'
};

const schoolUpgradeMap = {
    'תלמוד תורה': 'ישיבה קטנה',
    'ישיבה קטנה': 'ישיבה גדולה'
};
const schoolUpgradeMap2 = {
    'בית ספר יסודי': 'תיכון',
    'תיכון': 'סמינר (יג יד)'
};
async function upgradeClasses() {
    try {
        const students = await StudiesForStudent.findAll({
            include: {
                model: Student,
                attributes: ['St_gender'],
            }
        });

        const currentYear = new Date().getFullYear();

        for (const record of students) {
            if (record.SFS_last_upgrade_year === currentYear) continue;

            const currentClass = record.SFS_current_class;
            const gender = record.Student?.St_gender;

            if (!gender || !currentClass) continue;

            const isFemale = gender === 2;
            const upgradeMap = isFemale ? classUpgradeMap2 : classUpgradeMap;
            const newClass = upgradeMap[currentClass];
            let newSchool = "";
            if (newClass) {
                record.SFS_current_class = newClass;
                //בן
                if (newClass == "כיתה ט" || newClass == "כיתה יג") {
                    newSchool = schoolUpgradeMap2[record.SFS_current_school];
                    if (newSchool) {
                        record.SFS_current_school = newSchool
                    }
                }
                //בת
                if (newClass == "שיעור א" ||newClass == "שיעור א י.גדולה") {
                    newSchool = schoolUpgradeMap[record.SFS_current_school];
                    if (newSchool) {
                        record.SFS_current_school = newSchool
                    }
                }
                record.SFS_last_upgrade_year = currentYear;
                await record.save();
            }
        }

        console.log("Class upgrade completed successfully.");
    } catch (error) {
        console.error("Error upgrading classes:", error);
    }
}

module.exports = { upgradeClasses };
