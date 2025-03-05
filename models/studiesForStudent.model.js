const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const StudiesForStudent = sequelize.define("StudiesForStudent", {
    SFS_code: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    SFS_student_code: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: "Student", // שם הטבלה
            key: "St_code"
        }
    },
    SFS_current_school: {
        type: DataTypes.STRING(60),
        allowNull: true
    },
    SFS_current_school_ame: {
        type: DataTypes.STRING(60),
        allowNull: true
    },
    SFS_reception_class: {
        type: DataTypes.STRING(60),
        allowNull: true
    },
    SFS_current_class: {
        type: DataTypes.STRING(60),
        allowNull: true
    },
    SFS_previous_institutions: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    SFS_previous_school: {
        type: DataTypes.STRING(100),
        allowNull: true
    }
}, {
    tableName: "studiesForStudent",
    timestamps: false
});

// הגדרת מפתחות זרים באמצעות associations
StudiesForStudent.associate = function (models) {
    StudiesForStudent.belongsTo(models.Student, { foreignKey: "SFS_student_code" });
};

module.exports = StudiesForStudent;
