const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const StudentForActivity = sequelize.define("StudentForActivity", {
    SFA_code: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    SFA_code_activity: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: "activity", // שם הטבלה Activity
            key: "AFS_code"
        }
    },
    SFA_code_student: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: "student", // שם הטבלה Student
            key: "St_code"
        }
    }
}, {
    tableName: "studentForActivity",
    timestamps: false
});

// הגדרת מפתחות זרים באמצעות associations
StudentForActivity.associate = function (models) {
    StudentForActivity.belongsTo(models.Activity, { foreignKey: "SFA_code_activity" });
    StudentForActivity.belongsTo(models.Student, { foreignKey: "SFA_code_student" });
};

module.exports = StudentForActivity;
