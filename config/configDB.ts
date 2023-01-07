import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createConnection({
    host: process.env.AWS_RDS_HOST,
    port: Number(process.env.AWS_RDS_PORT),
    user: process.env.AWS_RDS_USER,
    password: process.env.AWS_RDS_PASSWORD,
    database: process.env.AWS_RDS_DB
});

export const connectMySQLDB = () => db.connect( err => {
    if(err) {
        console.log(err.message);
        return;
    }

    console.log("Amazon RDS is connected successfully!");
});