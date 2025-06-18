// models/task.model.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Task = sequelize.define("Task", {
    Ta_code: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    Ta_worker_code: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: 'worker', // טבלה שמקורה ב- Worker
            key: 'Wo_code'
        }
    },
    Ta_description: {
        type: DataTypes.STRING(4000),
        allowNull: true
    },
    Ta_date: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    Ta_time: {
        type: DataTypes.STRING(5),
        allowNull: true
    },
    Ta_done: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0 // ערך בוליאני: 0 או 1
    }
}, {
    tableName: "task", // שם הטבלה במסד הנתונים
    timestamps: false // לא נרצה להשתמש בזמן יצירה/עדכון אוטומטי
});
Task.associate = function(models) {
    Task.belongsTo(models.Worker, {foreignKey: "Ta_worker_code"});
};
module.exports = Task;
