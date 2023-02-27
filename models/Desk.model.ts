import { DataTypes } from "sequelize";
import { sequelize } from "../config/configDB";

// associates
import Place from "./Place.model";

const Desk = sequelize.define('Desk', {
    desk_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: 'desk_id'
    },
    desk_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    desk_type: {
        type: DataTypes.ENUM('a', 'b', 'c'),
        defaultValue: 'a',
        allowNull: false
    },
    min_seat: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    max_seat: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},{
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: true
});

// association declaration
Place.hasMany(Desk, {
    foreignKey: {
        name: 'place_id',
        type: DataTypes.UUID,
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    hooks: true
});
Desk.belongsTo(Place);

export default Desk;