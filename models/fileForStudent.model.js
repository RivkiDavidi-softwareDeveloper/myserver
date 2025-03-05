const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const FileForStudent = sequelize.define("FileForStudent", {
    FFS_code: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    FFS_name: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    FFS_student_code: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: "Student", // שם הטבלה
            key: "St_code"
        }
    },
    FFS_link_to_file: {
        type: DataTypes.STRING(400),
        allowNull: true
    }
}, {
    tableName: "fileForStudent",
    timestamps: false
});

// הגדרת מפתחות זרים באמצעות associations
FileForStudent.associate = function (models) {
    FileForStudent.belongsTo(models.Student, { foreignKey: "FFS_student_code" });
};

module.exports = FileForStudent;
