// models/systemLogin.model.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SystemLogin = sequelize.define("SystemLogin", {
    SL_code: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    SL_name: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    SL_password: {
        type: DataTypes.STRING(20),
        allowNull: true
    }
}, {
    tableName: "systemLogin", // שם הטבלה במסד הנתונים
    timestamps: false // לא נרצה להשתמש בזמן יצירה/עדכון אוטומטי
});

module.exports = SystemLogin;
