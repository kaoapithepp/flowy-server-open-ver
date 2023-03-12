import { DataTypes } from "sequelize";
import { sequelize } from "../config/configDB";

const Booking = sequelize.define('Booking', {
    booking_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: 'booking_id'
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    place_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    desk_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    total_bk_hr: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    total_bk_seat: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    total_bk_price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('created', 'completed', 'canceled', 'invalid'),
        defaultValue: 'created',
        allowNull: false
    },
},{
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: true
});

export default Booking;