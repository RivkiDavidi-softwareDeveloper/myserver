const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CommonStudentForWorker = sequelize.define("CommonStudentForWorker", {
    CSFP_code: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    CSFP_code_worker: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: "Worker", // שם הטבלה
            key: "Wo_code"
        }
    },
    CSFP_code_student: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: "Student", // שם הטבלה
            key: "St_code"
        }
    }
}, {
    tableName: "commonStudentForWorker",
    timestamps: false
});

// הגדרת מפתחות זרים באמצעות associations
CommonStudentForWorker.associate = function (models) {
    CommonStudentForWorker.belongsTo(models.Worker, { foreignKey: "CSFP_code_worker" });
    CommonStudentForWorker.belongsTo(models.Student, { foreignKey: "CSFP_code_student" });
};

module.exports = CommonStudentForWorker;
