import { Sequelize } from 'sequelize'; 
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
    `${process.env.AWS_RDS_DB}`,
    `${process.env.AWS_RDS_USER}`,
    `${process.env.AWS_RDS_PASSWORD}`,
    {
        host: process.env.AWS_RDS_HOST,
        port: Number(process.env.AWS_RDS_PORT),
        dialect: 'mysql',
        pool: {
            acquire: 50000,
            idle: 30000
        },
        dialectOptions: {
            ssl: "Amazon RDS"
        },
        logging: console.log,
    }
);

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });
        console.log('AWS RDS has been established and synced successfully.');
        // sequelize.close();
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};



