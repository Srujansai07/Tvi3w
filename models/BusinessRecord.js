import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const BusinessRecord = sequelize.define('BusinessRecord', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    type: {
        type: DataTypes.ENUM('pitch', 'contract', 'venue', 'contact'),
        allowNull: false
    },
    title: {
        type: DataTypes.STRING
    },
    content: {
        type: DataTypes.TEXT
    },
    analysis: {
        type: DataTypes.JSONB
    },
    metadata: {
        type: DataTypes.JSONB,
        defaultValue: {}
    }
}, {
    timestamps: true
});

export default BusinessRecord;
