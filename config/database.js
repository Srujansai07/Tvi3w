import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import dns from 'dns';

// Force IPv4 for Supabase connection (fix for ENETUNREACH on Railway)
dns.setDefaultResultOrder('ipv4first');

dotenv.config();

// Supabase connection string format: postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'postgresql://postgres:231100813aiiTgn@db.ptkoregmemknufnpnnfc.supabase.co:5432/postgres',
  {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Required for Supabase
      }
    },
    logging: false, // Set to console.log to see SQL queries
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export default sequelize;
