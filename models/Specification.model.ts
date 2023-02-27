import { DataTypes } from "sequelize";
import { sequelize } from "../config/configDB";

// associates
import Place from "./Place.model";

const Specification = sequelize.define('Specification', {
    spec_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: 'spec_id'
    },
    good_for: {
        type: DataTypes.ENUM('read', 'work', 'meeting', 'hang out'),
        defaultValue: 'read',
        allowNull: false
    },
    most_suit_for: {
        type: DataTypes.ENUM('individual', 'group', 'company'),
        defaultValue: 'individual',
        allowNull: false
    },
    isQuiet: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isLoudable: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isAtmospheric: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isSmokable: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
    
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: true
});

Place.hasOne(Specification, {
    foreignKey: {
        name: 'place_id',
        type: DataTypes.UUID,
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    hooks: true
});
Specification.belongsTo(Place);

export default Specification;