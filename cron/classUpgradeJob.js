const cron = require("node-cron");
const { upgradeClasses } = require("../services/classPromotionService");

// תריץ כל שנה ב־1 בספטמבר בשעה 00:00ע
cron.schedule("0 0 1 9 *", async () => {
  console.log("Running class upgrade job on June 4th at 09:46...");
  await upgradeClasses();
});


