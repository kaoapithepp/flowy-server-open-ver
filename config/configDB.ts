import { Sequelize } from 'sequelize'; 
import dotenv from 'dotenv';

dotenv.config();


export const sequelize = new Sequelize(
    `${process.env.GCP_SQL_DB}`,
    `${process.env.GCP_SQL_USER}`,
    `${process.env.GCP_SQL_PASSWORD}`,
    {
        host: process.env.GCP_SQL_HOST,
        port: Number(process.env.GCP_SQL_PORT),
        dialect: 'mysql',
        pool: {
            acquire: 50000,
            idle: 30000
        }
    }
);

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Google Cloud SQL has been established successfully.');
        sequelize.close();
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};



