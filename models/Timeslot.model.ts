import { DataTypes } from "sequelize";
import { sequelize } from "../config/configDB";
import Booking from "./Booking.model";
import Desk from "./Desk.model";

const Timeslot = sequelize.define('Timeslot', {
    timeslot_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: 'timeslot_id'
    },
    start_time: {
        type: DataTypes.STRING,
        allowNull: false
    },
    end_time: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    orderNo: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    occupied_seat: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    booking_id: {
        type: DataTypes.UUID,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('vacant', 'pending', 'occupied'),
        defaultValue: 'vacant',
        allowNull: false
    }
},{
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: true
});

Desk.hasMany(Timeslot, {
    foreignKey: {
        name: 'desk_id',
        type: DataTypes.UUID,
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    hooks: true
});
Timeslot.belongsTo(Desk);


export default Timeslot;