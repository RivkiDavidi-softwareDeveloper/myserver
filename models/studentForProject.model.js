const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const StudentForProject = sequelize.define("StudentForProject", {
    SFP_code: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    SFP_code_project: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: "Project", // שם הטבלה Project
            key: "Pr_code"
        }
    },
    SFP_code_student: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: "Student", // שם הטבלה Student
            key: "St_code"
        }
    },
    SFP_code_guide: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: "GuideForProject", // שם הטבלה GuideForProject
            key: "GFP_code"
        }
    },
    SFP_name_school_bein_hazmanim: {
        type: DataTypes.STRING(40),
        allowNull: true
    },

    SFP_veshinantem: {
        type: DataTypes.STRING(40),
        allowNull: true
    },
}, {
    tableName: "studentForProject",
    timestamps: false
});

// הגדרת קשרים בין הטבלאות
StudentForProject.associate = function (models) {
    StudentForProject.belongsTo(models.Project, { foreignKey: "SFP_code_project" });
    StudentForProject.belongsTo(models.Student, { foreignKey: "SFP_code_student" });
    StudentForProject.belongsTo(models.GuideForProject, { foreignKey: "SFP_code_guide" });
};

module.exports = StudentForProject;
