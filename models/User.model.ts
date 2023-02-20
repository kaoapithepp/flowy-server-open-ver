import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/configDB";

interface IUser extends Model {
    user_id: string;
    password: string;
}

const User = sequelize.define<IUser>('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tel_no: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    profile_imgUrl: {
        type: DataTypes.STRING,
        defaultValue: "https://global.discourse-cdn.com/turtlehead/original/2X/c/c830d1dee245de3c851f0f88b6c57c83c69f3ace.png",
        allowNull: false
    },
    cc_card_no: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: true
});

export default User;