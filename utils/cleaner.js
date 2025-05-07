/**
 * מסיר שדות מזהים או שדות לא רצויים מאובייקט נתון
 * @param {Object} obj - האובייקט המקורי
 * @param {string[]} keysToRemove - מערך של שמות שדות להסרה
 * @returns {Object} עותק של האובייקט ללא השדות שהוסרו
 */
function clean(obj, keysToRemove) {
    const clone = { ...obj };
    keysToRemove.forEach(k => delete clone[k]);
    return clone;
}

module.exports = { clean };
