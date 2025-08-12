import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

console.log(process.env.DB_USER);

export const db = new Pool({
    user: process.env.DB_USER || "postgres.rhwvxicrlrwxveyrzanh",
    host: process.env.DB_HOST || "aws-0-us-east-1.pooler.supabase.com",
    database: process.env.DB_NAME || "pd_carlos_rojas_gosling",
    password: process.env.DB_PASSWORD || "carturo3a",
    port: 6543, // Default PostgreSQL port
    ssl: {rejectUnauthorized: false} // Supabase requiere SSL
});
