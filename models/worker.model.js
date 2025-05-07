// models/worker.model.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Worker = sequelize.define("Worker", {
    Wo_code: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    Wo_ID: {
        type: DataTypes.STRING(9),
        allowNull: false
    },
    Wo_gender: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: "TypeGender", // טבלה המקושרת
            key: "TG_code"
        }
    },
    Wo_type_worker: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: "TypeWorker", // טבלה המקושרת
            key: "TW_code"
        }
    },
    Wo_name: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    Wo_Fname: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    Wo_password: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    Wo_cell_phone: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    Wo_email: {
        type: DataTypes.STRING(90),
        allowNull: true
    }
}, {
    tableName: "worker",
    timestamps: false
});

// הגדרת הקשרים בין הישויות ב-Sequelize
Worker.associate = function (models) {
    Worker.belongsTo(models.TypeGender, { foreignKey: "Wo_gender" });
    Worker.belongsTo(models.TypeWorker, { foreignKey: "Wo_type_worker" });
    Worker.hasMany(models.Activity, { foreignKey: "AFS_worker_code" });
    Worker.hasMany(models.Task, { foreignKey: "Ta_worker_code"});
};

module.exports = Worker;
