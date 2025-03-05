// models/typeRisk.model.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TypeRisk = sequelize.define("TypeRisk", {
    TR_code: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    TR_name: {
        type: DataTypes.STRING(20),
        allowNull: false
    }
}, {
    tableName: "typeRisk", // שם הטבלה במסד הנתונים
    timestamps: false // לא נרצה להשתמש בזמן יצירה/עדכון אוטומטי
});

module.exports = TypeRisk;
