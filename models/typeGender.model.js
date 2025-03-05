// models/typeGender.model.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TypeGender = sequelize.define("TypeGender", {
    TG_code: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    TG_name: {
        type: DataTypes.STRING(20),
        allowNull: false
    }
}, {
    tableName: "typeGender", // שם הטבלה במסד הנתונים
    timestamps: false // לא נרצה להשתמש בזמן יצירה/עדכון אוטומטי
});

module.exports = TypeGender;
