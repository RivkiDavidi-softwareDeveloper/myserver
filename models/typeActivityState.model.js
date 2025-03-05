// models/typeActivityState.model.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TypeActivityState = sequelize.define("TypeActivityState", {
    TAS_code: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    TAS_name: {
        type: DataTypes.STRING(20),
        allowNull: false
    }
}, {
    tableName: "typeActivityState", // שם הטבלה במסד הנתונים
    timestamps: false // לא נרצה להשתמש בזמן יצירה/עדכון אוטומטי
});

module.exports = TypeActivityState;
