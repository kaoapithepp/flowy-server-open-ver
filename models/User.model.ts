import { DataTypes } from "sequelize";
import { sequelize } from "../config/configDB";

// interfaces
import { IUser } from "../interfaces/iuser.interface";

const User = sequelize.define<IUser>('User', {
    user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: 'user_id'
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
        unique: 'email'
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tel_no: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'tel_no'
    },
    profile_imgUrl: {
        type: DataTypes.STRING,
        defaultValue: "https://global.discourse-cdn.com/turtlehead/original/2X/c/c830d1dee245de3c851f0f88b6c57c83c69f3ace.png",
        allowNull: false
    },
    cc_card_no: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: 'cc_card_no'
    }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: true
});

export default User;