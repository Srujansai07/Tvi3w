import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Supabase Connection Pooler (IPv4 compatible)
// Host: aws-0-ap-south-1.pooler.supabase.com (Mumbai)
// User: postgres.[project-ref]
// Port: 5432 (Session Mode)
const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'postgres://postgres.ptkoregmemknufnpnnfc:231100813aiiTgn@aws-0-ap-south-1.pooler.supabase.com:5432/postgres',
  {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export default sequelize;
