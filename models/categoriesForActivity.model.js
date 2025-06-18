const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CategoriesForActivity = sequelize.define("CategoriesForActivity", {
    CFA_code: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    CFA_code_activity: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: "activity", // שם הטבלה Activity
            key: "AFS_code"
        }
    },
    CFA_code_type_activity: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: "typeOfActivity", // שם הטבלה TypeOfActivity
            key: "TOA_code"
        }
    }
}, {
    tableName: "categoriesForActivity",
    timestamps: false
});

// הגדרת מפתחות זרים באמצעות associations
CategoriesForActivity.associate = function (models) {
    CategoriesForActivity.belongsTo(models.Activity, { foreignKey: "CFA_code_activity" });
    CategoriesForActivity.belongsTo(models.TypeOfActivity, { foreignKey: "CFA_code_type_activity" });
};

module.exports = CategoriesForActivity;
