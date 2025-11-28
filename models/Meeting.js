import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Meeting = sequelize.define('Meeting', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        defaultValue: 'Untitled Meeting'
    },
    startTime: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    endTime: {
        type: DataTypes.DATE
    },
    durationSeconds: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    transcript: {
        type: DataTypes.TEXT
    },
    keyPoints: {
        type: DataTypes.JSONB,
        defaultValue: []
    },
    questionsGenerated: {
        type: DataTypes.JSONB,
        defaultValue: []
    },
    summary: {
        type: DataTypes.TEXT
    }
}, {
    timestamps: true
});

export default Meeting;
