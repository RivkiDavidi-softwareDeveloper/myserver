const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const FileForMessage = sequelize.define("FileForMessage", {
    FFM_code: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    FFM_name: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    FFM_message_code: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: "messageForCall", // שם הטבלה
            key: "MFC_code"
        }
    },
    FFM_link_to_file: {
        type: DataTypes.STRING(400),
        allowNull: true
    }
}, {
    tableName: "fileForMessage",
    timestamps: false
});

// הגדרת מפתחות זרים באמצעות associations
FileForMessage.associate = function (models) {
    FileForMessage.belongsTo(models.MessageForCall, { foreignKey: "FFM_message_code" });
};

module.exports = FileForMessage;
