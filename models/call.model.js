// models/call.model.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Call = sequelize.define("Call", {
    Ca_code: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    Ca_topic: {
        type: DataTypes.STRING(2000),
        allowNull: true
    }
}, {
    tableName: "calll", // שם הטבלה במסד הנתונים
    timestamps: false // לא נרצה להשתמש בזמן יצירה/עדכון אוטומטי
});

module.exports = Call;
