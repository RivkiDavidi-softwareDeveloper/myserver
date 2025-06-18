const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Synagogue = sequelize.define("Synagogue", {
    Sy_code: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    Sy_name: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    Sy_code_Community: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: "community", // שם הטבלה
            key: "Com_code"
        }
    }
}, {
    tableName: "synagogue",
    timestamps: false
});

// הגדרת מפתחות זרים באמצעות associations
Synagogue.associate = function (models) {
    Synagogue.belongsTo(models.Community, { foreignKey: "Sy_code_Community" });
};

module.exports = Synagogue;
