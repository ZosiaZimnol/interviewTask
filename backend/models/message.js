import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";

const Message = sequelize.define("Message", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

export default Message;
