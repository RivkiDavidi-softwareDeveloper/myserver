// models/typeWorker.model.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TypeWorker = sequelize.define("TypeWorker", {
    TW_code: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    TW_name: {
        type: DataTypes.STRING(20),
        allowNull: false
    }
}, {
    tableName: "typeWorker", // שם הטבלה במסד הנתונים
    timestamps: false // לא נרצה להשתמש בזמן יצירה/עדכון אוטומטי
});

module.exports = TypeWorker;
