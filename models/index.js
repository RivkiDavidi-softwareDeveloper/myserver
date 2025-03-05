const sequelize = require("../config/database");
const City = require("./city.model");
const Student = require("./student.model");
const TypeActivityState=require("./typeActivityState.model")
const TypeRisk = require("./typeRisk.model");
const TypeDifficulty = require("./typeDifficulty.model");
const TypeWorker=require("./typeWorker.model")
const TypeGender= require("./typeGender.model")
const TypeTask=require("./typeTask.model")
const TypeOfActivity= require("./typeOfActivity.model")
const SystemLogin=require("./systemLogin.model")
const Parent = require("./parent.model")
const Worker= require("./worker.model")
const Task= require("./task.model")
const Call=require("./call.model")
const MessageForCall= require("./messageForCall.model")
const RecipientForMessage= require("./recipientForMessage.model")
const FileForMessage= require("./fileForMessage.model")
const FileForWorker=require("./fileForWorker.model")
const Community=require("./community.model")
const Synagogue= require("./synagogue.model")
const Frequency= require("./frequency.model")
const FileForStudent=require("./fileForStudent.model")
const StudiesForStudent= require("./studiesForStudent.model")
const DifficultyStudent=require("./difficultyStudent.model")
const CommonStudentForWorker= require("./commonStudentForWorker.model")
const Activity=require("./activity.model")
const CategoriesForActivity= require("./categoriesForActivity.model")
const SubcategoryForTypeActivity= require("./subcategoryForTypeActivity.model")
const StudentForActivity= require("./studentForActivity.model")
const Project= require("./project.model")
const GuideForProject =require("./guideForProject.model")
const Sharer= require("./sharer.model")
const StudiesForSharer=require("./studiesForSharer.model")
const SharerForProject=require("./sharerForProject.model")
const StudentForProject=require("./studentForProject.model")


sequelize.sync()
    .then(() => console.log("Database & tables created!"))
    .catch(err => console.log("Error syncing database:", err));

module.exports = { sequelize,Sharer,GuideForProject,Project,StudentForActivity,SubcategoryForTypeActivity,CategoriesForActivity
    ,Activity,CommonStudentForWorker,DifficultyStudent,StudiesForStudent,FileForStudent,Frequency,Synagogue,Community,Call, 
    FileForWorker,FileForMessage,MessageForCall,RecipientForMessage,Task,Worker,SystemLogin,Parent,TypeOfActivity,TypeTask, 
    Student, City, StudiesForSharer,StudentForProject,SharerForProject,TypeActivityState, TypeRisk, TypeDifficulty,TypeWorker, TypeGender};
