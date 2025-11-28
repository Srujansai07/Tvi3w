import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true, // Twitter might not return email
        unique: true,
        validate: {
            isEmail: true
        }
    },
    displayName: {
        type: DataTypes.STRING
    },
    avatarUrl: {
        type: DataTypes.STRING
    },
    googleId: {
        type: DataTypes.STRING,
        unique: true
    },
    linkedinId: {
        type: DataTypes.STRING,
        unique: true
    },
    twitterId: {
        type: DataTypes.STRING,
        unique: true
    },
    provider: {
        type: DataTypes.STRING
    },
    rawProfile: {
        type: DataTypes.JSONB
    }
}, {
    timestamps: true
});

export default User;
