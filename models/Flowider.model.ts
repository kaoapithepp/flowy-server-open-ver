import { DataTypes } from "sequelize";
import { sequelize } from "../config/configDB";

// interfaces
import { IFlowider } from "../interfaces/iflowider.interface";

const Flowider = sequelize.define<IFlowider>('Flowider', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    flowider_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: 'flowider_id'
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
    bnk_acc: {
        type: DataTypes.STRING(12),
        allowNull: true,
        unique: 'bnk_acc'
    },
    bnk_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    profile_imgUrl: {
        type: DataTypes.STRING,
        defaultValue: "https://global.discourse-cdn.com/turtlehead/original/2X/c/c830d1dee245de3c851f0f88b6c57c83c69f3ace.png",
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: true
});

export default Flowider;