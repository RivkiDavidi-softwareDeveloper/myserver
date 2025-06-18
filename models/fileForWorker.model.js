const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const FileForWorker = sequelize.define("FileForWorker", {
    FFW_code: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    FFW_name: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    FFW_worker_code: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: "worker", // שם הטבלה
            key: "Wo_code"
        }
    },
    FFW_link_to_file: {
        type: DataTypes.STRING(400),
        allowNull: true
    }
}, {
    tableName: "fileForWorker",
    timestamps: false
});

// הגדרת מפתחות זרים באמצעות associations
FileForWorker.associate = function (models) {
    FileForWorker.belongsTo(models.Worker, { foreignKey: "FFW_worker_code" });
};

module.exports = FileForWorker;
