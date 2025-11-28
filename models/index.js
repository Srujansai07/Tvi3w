import sequelize from '../config/database.js';
import Analysis from './Analysis.js';
import Meeting from './Meeting.js';
import BusinessRecord from './BusinessRecord.js';
import User from './User.js';

// Associations
User.hasMany(Analysis);
User.hasMany(Meeting);
User.hasMany(BusinessRecord);

Analysis.belongsTo(User);
Meeting.belongsTo(User);
BusinessRecord.belongsTo(User);

const db = {
    sequelize,
    Analysis,
    Meeting,
    BusinessRecord,
    User
};

export default db;
export { sequelize, Analysis, Meeting, BusinessRecord, User };
