const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SharerForProject = sequelize.define("SharerForProject", {
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
    SFP_code_Sharer: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: "Sharer", // שם הטבלה Sharer
            key: "Sh_code"
        }
    },
    SFP_code_guide: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: "GuideForProject", // שם הטבלה GuideForProject
            key: "GFP_code"
        }
    }
}, {
    tableName: "sharerForProject",
    timestamps: false
});

// הגדרת קשרים בין הטבלאות
SharerForProject.associate = function (models) {
    SharerForProject.belongsTo(models.Project, { foreignKey: "SFP_code_project" });
    SharerForProject.belongsTo(models.Sharer, { foreignKey: "SFP_code_Sharer" });
    SharerForProject.belongsTo(models.GuideForProject, { foreignKey: "SFP_code_guide" });
};

module.exports = SharerForProject;
