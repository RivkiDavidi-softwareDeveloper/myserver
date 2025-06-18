

const sequelize = require("../config/database");
const models = {
    City: require("./city.model"),
    Student: require("./student.model"),
    TypeActivityState: require("./typeActivityState.model"),
    TypeRisk: require("./typeRisk.model"),
    TypeDifficulty: require("./typeDifficulty.model"),
    TypeWorker: require("./typeWorker.model"),
    TypeGender: require("./typeGender.model"),
    TypeTask: require("./typeTask.model"),
    TypeOfActivity: require("./typeOfActivity.model"),
    SystemLogin: require("./systemLogin.model"),
    Parent: require("./parent.model"),
    Worker: require("./worker.model"),
    Task: require("./task.model"),
    Call: require("./call.model"),
    MessageForCall: require("./messageForCall.model"),
    RecipientForMessage: require("./recipientForMessage.model"),
    FileForMessage: require("./fileForMessage.model"),
    FileForWorker: require("./fileForWorker.model"),
    Community: require("./community.model"),
    Synagogue: require("./synagogue.model"),
    Frequency: require("./frequency.model"),
    FileForStudent: require("./fileForStudent.model"),
    StudiesForStudent: require("./studiesForStudent.model"),
    DifficultyStudent: require("./difficultyStudent.model"),
    CommonStudentForWorker: require("./commonStudentForWorker.model"),
    Activity: require("./activity.model"),
    CategoriesForActivity: require("./categoriesForActivity.model"),
    SubcategoryForTypeActivity: require("./subcategoryForTypeActivity.model"),
    StudentForActivity: require("./studentForActivity.model"),
    Project: require("./project.model"),
    GuideForProject: require("./guideForProject.model"),
    Sharer: require("./sharer.model"),
    StudiesForSharer: require("./studiesForSharer.model"),
    SharerForProject: require("./sharerForProject.model"),
    StudentForProject: require("./studentForProject.model")
};

// הפעלת associate אם קיים בכל מודל
Object.values(models).forEach(model => {
    if (model.associate) {
        model.associate(models);
    }
});

sequelize.sync()
    .then(() => console.log("Database & tables created!"))
    .catch(err => console.log("Error syncing database:", err));

module.exports = { sequelize, ...models };
