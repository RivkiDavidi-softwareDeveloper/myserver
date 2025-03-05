const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const RecipientForMessage = sequelize.define("RecipientForMessage", {
    RFM_code: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    RFM_message_code: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: "MessageForCall", // שם הטבלה
            key: "MFC_code"
        }
    },
    RFM_worker_code: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: "Worker", // שם הטבלה
            key: "Wo_code"
        }
    },
    RFM_done: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: "recipientForMessage",
    timestamps: false
});

// הגדרת מפתחות זרים באמצעות associations
RecipientForMessage.associate = function (models) {
    RecipientForMessage.belongsTo(models.MessageForCall, { foreignKey: "RFM_message_code" });
    RecipientForMessage.belongsTo(models.Worker, { foreignKey: "RFM_worker_code" });
};

module.exports = RecipientForMessage;
