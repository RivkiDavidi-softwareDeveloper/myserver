const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SubcategoryForTypeActivity = sequelize.define("SubcategoryForTypeActivity", {
    SFTA_code: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    SFTA_code_type_activity: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: "TypeOfActivity", // שם הטבלה TypeOfActivity
            key: "TOA_code"
        }
    },
    SFTA_name: {
        type: DataTypes.STRING(30),
        allowNull: true
    }
}, {
    tableName: "subcategoryForTypeActivity",
    timestamps: false
});

// הגדרת מפתח זר באמצעות associations
SubcategoryForTypeActivity.associate = function (models) {
    SubcategoryForTypeActivity.belongsTo(models.TypeOfActivity, { foreignKey: "SFTA_code_type_activity" });
};

module.exports = SubcategoryForTypeActivity;
