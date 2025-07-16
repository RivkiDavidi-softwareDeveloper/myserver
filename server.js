const express = require("express");
const cors = require("cors");
const models = require("./models");
const sequelize = models.sequelize;
const distanceRoutes = require('./routes/distance.routes');
const studentRoutes = require("./routes/student.routes");
const sharerRoutes = require("./routes/sharer.routes");

const cityRoutes = require("./routes/city.routes");
const typeActivityStateRoutes = require("./routes/typeActivityState.routes");
const typeRiskRoutes = require("./routes/typeRisk.routes");
const typeWorkerRoutes = require("./routes/typeWorker.routes");
const typeGenderRoutes = require("./routes/typeGender.routes");
const typeTaskRoutes = require("./routes/typeTask.routes");
const typeOfActivityRoutes = require("./routes/typeOfActivity.routes");
const systemLoginRoutes = require("./routes/systemLogin.routes");
const parentRoutes = require("./routes/parent.routes");
const workerRoutes = require("./routes/worker.routes");
const taskRoutes = require("./routes/task.routes");
const callRoutes = require("./routes/call.routes");
const messageForCallRoutes = require("./routes/messageForCall.routes");
const recipientForMessageRoutes = require("./routes/recipientForMessage.routes");
const fileForMessageRoutes = require("./routes/fileForMessage.routes");
const fileForWorkerRoutes = require("./routes/fileForWorker.routes");
const communityRoutes = require("./routes/community.routes");
const synagogueRoutes = require("./routes/synagogue.routes");
const frequencyRoutes = require("./routes/frequency.routes");
const studiesForSharerRoutes = require("./routes/studiesForSharer.routes");
const studiesForStudentRoutes = require("./routes/studiesForStudent.routes");
const studentForProjectRoutes = require("./routes/studentForProject.routes");
const sharerForProjectRoutes = require("./routes/sharerForProject.routes");
const guideForProjectRoutes = require("./routes/guideForProject.routes");

const difficultyStudentRoutes= require("./routes/difficultyStudent.routes")
const activityRoutes= require("./routes/activity.routes")
const categoriesForActivityRoutes= require("./routes/categoriesForActivity.routes")
const projectRoutes= require("./routes/project.routes")
const subcategoryForTypeActivityRoutes= require("./routes/subcategoryForTypeActivity.routes")
const dashboardRoutes= require("./routes/dashboard.routes")

require("dotenv").config();
require("./cron/classUpgradeJob");
require("./cron/birthday-checkerJob");

const app = express();
app.use(cors());
app.use(express.json());




app.use('/api/distance', distanceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/shareres", sharerRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/categoriesForActivities", categoriesForActivityRoutes);
app.use("/api/typeActivityStates", typeActivityStateRoutes);
app.use("/api/typeRisks", typeRiskRoutes);
app.use("/api/typeWorkers", typeWorkerRoutes);
app.use("/api/typeGenders", typeGenderRoutes);
app.use("/api/typeTasks", typeTaskRoutes);
app.use("/api/typeOfActivities", typeOfActivityRoutes);
app.use("/api/systemLogins", systemLoginRoutes);
app.use("/api/studentForProjects", studentForProjectRoutes);
app.use("/api/sharerForProjects", sharerForProjectRoutes);
app.use("/api/guideForProjects", guideForProjectRoutes);
app.use("/api/studiesForStudents", studiesForStudentRoutes );
app.use("/api/studiesForShareres", studiesForSharerRoutes);
app.use("/api/parents", parentRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/calls", callRoutes);
app.use("/api/messagesForCall", messageForCallRoutes);
app.use("/api/recipientsForMessage", recipientForMessageRoutes);
app.use("/api/filesForMessage", fileForMessageRoutes);
app.use("/api/filesForWorker", fileForWorkerRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api/synagogues", synagogueRoutes);
app.use("/api/frequencies", frequencyRoutes);
app.use("/api/difficultyStudents", difficultyStudentRoutes);
app.use("/api/subcategoryForTypeActivities", subcategoryForTypeActivityRoutes);

////סיכרון נתונים

/* const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: { origin: "*" }
});
 */
// שמירה על גישה ל־io בכל מקום
/* app.set("socketio", io);
 */
// דוגמה - האזנה לחיבור
/* io.on("connection", socket => {
  console.log("Client connected");
});
 */

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    try {
        await sequelize.authenticate();
        console.log(`Server is running on port ${PORT} and connected to DB`);
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
});
/* http.listen(PORT, async () => {
    try {
        await sequelize.authenticate();
        console.log(`Server is running on port ${PORT} and connected to DB`);
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
});
 */

