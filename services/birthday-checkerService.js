const { HDate } = require("@hebcal/core");
const { Student, Task } = require("../models");
const moment = require("moment");

const hebrewMonthMap = {
    'ניסן': 1, 'אייר': 2, 'סיון': 3, 'תמוז': 4, 'אב': 5, 'אלול': 6,
    'תשרי': 7, 'חשוון': 8, 'מרחשוון': 8, 'כסליו': 9, 'טבת': 10, 'שבט': 11,
    'אדר': 12, 'אדר א׳': 12, 'אדר א': 12, 'אדר ב׳': 13, 'אדר ב': 13
};
const reverseMonthMap = Object.entries(hebrewMonthMap).reduce((acc, [name, num]) => {
    if (!acc[num]) acc[num] = name;
    return acc;
}, {});

function parseHebrewDay(dayStr) {
    const gematriaMap = { 'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9, 'י': 10, 'כ': 20, 'ל': 30 };
    let total = 0;
    for (const ch of dayStr) total += gematriaMap[ch] || 0;
    return total;
}
function hebrewYearStringToNumber(hebrewStr) {
    const gematriaMap = {
        'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9,
        'י': 10, 'כ': 20, 'ל': 30, 'מ': 40, 'נ': 50, 'ס': 60, 'ע': 70, 'פ': 80, 'צ': 90,
        'ק': 100, 'ר': 200, 'ש': 300, 'ת': 400
    };
    let year = 0;
    for (const char of hebrewStr.replace(/["״׳]/g, '')) {
        year += gematriaMap[char] || 0;
    }
    return 5000 + year; // כל השנים אחרי 5000
}
function calculateHebrewAge(birthDay, birthMonth, birthYear, today) {
    const hToday = new HDate(today);
    let age = hToday.getFullYear() - birthYear;

    /*     if (
            hToday.getMonth() < birthMonth ||
            (hToday.getMonth() === birthMonth && hToday.getDate() < birthDay)
        ) {
            age--;
        } */

    return age;
}
/* function calculateHebrewAge(birthDay, birthMonth, birthYear, today) {
    const hToday = new HDate(today);
    let age = hToday.getFullYear() - birthYear;

    // השוואה על בסיס תאריך עברי מדויק
    const birthThisYear = new HDate(birthDay, birthMonth, hToday.getFullYear());

    if (hToday.compare(birthThisYear) < 0) {
        age--; // יום ההולדת עוד לא הגיע השנה
    }

    return age;
}  */

async function checkBirthdaysAndCreateTasks() {
    const allStudents = await Student.findAll();

    const today = new Date();
    const hToday = new HDate(today);
    const currentHebrewYear = hToday.getFullYear();

    const twoDaysLater = moment().add(1, 'days').startOf('day');

    for (const student of allStudents) {
        const hebrewDateStr = student.St_hebrew_date;
        if (!hebrewDateStr) continue;

        const parts = hebrewDateStr.split(" ");
        if (parts.length < 3) continue;

        const [dayStr, monthStr, yearStr] = parts;
        if (!dayStr || !monthStr || !yearStr) continue;
        const day = parseHebrewDay(dayStr);
        const month = hebrewMonthMap[monthStr];
        if (!day || !month) continue;

        const hdate = new HDate(day, month, currentHebrewYear);
        const gregorianDate = hdate.greg();

        if (!moment(gregorianDate).isSame(twoDaysLater, 'day')) continue;



        let age = null;
        try {
            const yearStr = parts[2];
            if (yearStr) {
                const yearNumber = hebrewYearStringToNumber(yearStr);
                const originalHDate = new HDate(day, month, yearNumber);
                const birthGDate = originalHDate.greg();
                //    age = moment().diff(moment(birthGDate), 'years');
                age = calculateHebrewAge(day, month, yearNumber, today);

            }
        } catch {
            age = null;
        }

        // יצירת משימה
        await Task.create({
            Ta_worker_code: student.St_worker_code,
            Ta_description: `יומולדת לחניך ${student.St_name || ''} ${student.St_Fname || ''} גיל ${age} בתאריך ${dayStr} ${monthStr}`,
            Ta_date: moment(gregorianDate).format("YYYY-MM-DD"),
            Ta_time: '08:00',
            Ta_done: 0
        });
    }
}

module.exports = checkBirthdaysAndCreateTasks;
