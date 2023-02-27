import { DataTypes } from "sequelize";
import { sequelize } from "../config/configDB";

// associates
import Place from "./Place.model";

const Amenity = sequelize.define('Amenity', {
    amenity_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: 'amenity_id'
    },
    hasPowerSupply: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    hasWifi: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    hasRestroom: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    hasProjector: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    hasHDMI: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    hasFlowiderCare: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    hasAirCondition: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    hasNapZone: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    hasSnackAndBeverage: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    hasCCTVorSecurity: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: true
});

Place.hasOne(Amenity, {
    foreignKey: {
        name: 'place_id',
        type: DataTypes.UUID,
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    hooks: true
});
Amenity.belongsTo(Place);

export default Amenity;