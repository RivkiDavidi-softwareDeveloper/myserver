const { StudiesForStudent } = require("../models");
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
    'שיעור ג': 'שיעור א',
    'שיעור א': 'שיעור ב',
    'שיעור ב': 'שיעור ג',
    'שיעור ג': 'קיבוץ'

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
            if (record.SFS_last_upgrade_year === currentYear) continue; // כבר קודם

            const currentClass = record.SFS_current_class;
            const gender = record.Student?.St_gender;

            if (!gender || !currentClass) continue;

            const isFemale = gender === 2;
            const upgradeMap = isFemale ? classUpgradeMapFemale : classUpgradeMapMale;
            const newClass = upgradeMap[currentClass];

            if (newClass) {
                record.SFS_current_class = newClass;
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
