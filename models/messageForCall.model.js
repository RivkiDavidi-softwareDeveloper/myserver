const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const MessageForCall = sequelize.define("MessageForCall", {
    MFC_code: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    MFC_call_code: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: "Calll", // שם הטבלה
            key: "Ca_code"
        }
    },
    MFC_sender_worker_code: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: "Worker", // שם הטבלה
            key: "Wo_code"
        }
    },
    MFC_content: {
        type: DataTypes.STRING(4000),
        allowNull: true
    },
    MFC_date: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    MFC_time: {
        type: DataTypes.STRING(5),
        allowNull: true
    }
}, {
    tableName: "MessageForCall",
    timestamps: false
});

// הגדרת מפתחות זרים באמצעות associations
MessageForCall.associate = function (models) {
    MessageForCall.belongsTo(models.Call, { foreignKey: "MFC_call_code" });
    MessageForCall.belongsTo(models.Worker, { foreignKey: "MFC_sender_worker_code" });
};


  
module.exports = MessageForCall;
