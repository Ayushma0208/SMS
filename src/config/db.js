import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
// console.log("db>>>>>",db)

db.connect()
  .then(() => console.log('Connected to PostgreSQL (Neon) database.'))
  .catch(err => console.error('Database connection failed !!!', err));

export default db;
