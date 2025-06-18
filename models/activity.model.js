const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Activity = sequelize.define("Activity", {
    AFS_code: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    AFS_worker_code: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: "worker", // שם הטבלה
            key: "Wo_code"
        }
    },
    AFS_date: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    AFS_activity_time: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    AFS_with_who: {
        type: DataTypes.STRING(40),
        allowNull: true
    },
    AFS_short_description: {
        type: DataTypes.STRING(40),
        allowNull: true
    },
    AFS_description: {
        type: DataTypes.STRING(350),
        allowNull: true
    },
    AFS_price: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    AFS_exit: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    AFS_target: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    AFS_kilometer: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    AFS_name_school: {
        type: DataTypes.STRING(40),
        allowNull: true
    }
}, {
    tableName: "activity",
    timestamps: false
});

// הגדרת מפתחות זרים באמצעות associations
Activity.associate = function (models) {
    Activity.belongsTo(models.Worker, { foreignKey: "AFS_worker_code" });
    Activity.hasMany(models.StudentForActivity, { foreignKey: 'SFA_code_activity' });
    Activity.hasMany(models.CategoriesForActivity, { foreignKey: 'CFA_code_activity'   });
};

module.exports = Activity;
