
const cron = require('node-cron');
const checkBirthdaysAndCreateTasks = require('../services/birthday-checkerService');

// כל יום ב-29:15
cron.schedule('00 00 * * *', () => {
  console.log('Running birthday task at 00:00');
  checkBirthdaysAndCreateTasks()
    .then(() => console.log("בדיקת ימי הולדת הושלמה"))
    .catch(err => console.error("שגיאה בבדיקת ימי הולדת:", err));
});

