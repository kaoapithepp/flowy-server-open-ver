import { DataTypes } from "sequelize";
import { sequelize } from "../config/configDB";

// associates
import Flowider from "./Flowider.model";

const Place = sequelize.define('Place', {
    place_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: 'place_id'
    },
    place_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    lat_geo: {
        type: DataTypes.DOUBLE,
        allowNull: true
    },
    long_geo: {
        type: DataTypes.DOUBLE,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    place_category: {
        type: DataTypes.ENUM('House/Privates', 'Hotel', 'Cafe'),
        defaultValue: 'House/Privates',
        allowNull: false
    },
    unit_price: {
        type: DataTypes.INTEGER,
        defaultValue: 60,
        allowNull: false
    },
    open_hr: {
        type: DataTypes.TIME,
        allowNull: false
    },
    close_hr: {
        type: DataTypes.TIME,
        allowNull: false
    }
},{
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: true
});

// association declaration
Flowider.hasMany(Place, {
    foreignKey: {
        name: 'flowider_id',
        type: DataTypes.UUID,
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    hooks: true
});
Place.belongsTo(Flowider);

export default Place;