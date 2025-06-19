const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const GuideForProject = sequelize.define("GuideForProject", {
    GFP_code: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    GFP_code_project: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: "project", // שם הטבלה Project
            key: "Pr_code"
        }
    },
    GFP_name: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    GFP_ID: {
        type: DataTypes.STRING(9),
        allowNull: true
    }
}, {
    tableName: "guideForProject",
    timestamps: false
});

// הגדרת מפתח זר באמצעות associations
GuideForProject.associate = function (models) {
    GuideForProject.belongsTo(models.Project, { foreignKey: "GFP_code_project" });
};

module.exports = GuideForProject;
