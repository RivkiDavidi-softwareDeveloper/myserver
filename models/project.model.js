const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Project = sequelize.define("Project", {
    Pr_code: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    Pr_name: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    Pr_content: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    Pr_description: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    Pr_Place: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    Pr_date: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    Pr_gender: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: "typeGender", // שם הטבלה TypeGender
            key: "TG_code"
        }
    }
}, {
    tableName: "project",
    timestamps: false
});

// הגדרת מפתח זר באמצעות associations
Project.associate = function (models) {
    Project.belongsTo(models.TypeGender, { foreignKey: "Pr_gender" });
};

module.exports = Project;
