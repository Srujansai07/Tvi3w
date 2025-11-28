import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Analysis = sequelize.define('Analysis', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    platform: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'general'
    },
    sentimentScore: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    sentimentType: {
        type: DataTypes.ENUM('positive', 'negative', 'neutral'),
        defaultValue: 'neutral'
    },
    insights: {
        type: DataTypes.JSONB, // Using JSONB for flexible storage of array data
        defaultValue: []
    },
    rawResponse: {
        type: DataTypes.JSONB
    }
}, {
    timestamps: true
});

export default Analysis;
