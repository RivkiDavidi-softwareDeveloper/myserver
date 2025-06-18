const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DifficultyStudent = sequelize.define("DifficultyStudent", {
    DS_code: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    DS_diffculty_code: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: "typeDifficulty", // שם הטבלה
            key: "TD_code"
        }
    },
    DS_student_code: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: "student", // שם הטבלה
            key: "St_code"
        }
    }
}, {
    tableName: "difficultyStudent",
    timestamps: false
});

// הגדרת מפתחות זרים באמצעות associations
DifficultyStudent.associate = function (models) {
    DifficultyStudent.belongsTo(models.TypeDifficulty, { foreignKey: "DS_diffculty_code" });
    DifficultyStudent.belongsTo(models.Student, { foreignKey: "DS_student_code" });
};

module.exports = DifficultyStudent;
