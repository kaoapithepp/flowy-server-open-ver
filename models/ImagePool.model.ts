import { DataTypes } from "sequelize";
import { sequelize } from "../config/configDB";
import Desk from "./Desk.model";
import Place from "./Place.model";

const ImagePool = sequelize.define('ImagePool', {
    img_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: 'img_id'
    },
    img_uri: {
        type: DataTypes.STRING,
        allowNull: false
    },
    owner_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    owner_type: {
        type: DataTypes.ENUM('user', 'flowider', 'place', 'desk'),
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: true
});

export default ImagePool;