import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cron from "node-cron";
import { connectDB } from './config/configDB';

// utils
import { createTimeSlotForAllDesksRoutine } from './utils/timeslotUtils';

// import * as userRoutes from "./routes/user.route";
const userRoutes =  require('./routes/user.route');
const flowiderRoutes = require('./routes/flowider.route');
const placeRoutes = require('./routes/place.route');
const deskRoutes = require('./routes/desk.route');
const timeslotRoutes = require('./routes/timeslot.route');
const bookingRoutes = require('./routes/booking.route');
const scheduleRoutes = require('./routes/schedule.route');
const backdoorRoutes = require('./routes/backdoor.route');

// invoke dependencies
dotenv.config();
const app: Express = express();
connectDB();

// ECONNREFUSED prevention
process.on('uncaughtException', (err) => {
    console.log(err.message);
    process.exit(1);
});

// configuration
app.use(express.json({
    limit: "30mb"
}));

app.use(express.urlencoded({
    limit: "30mb",
    extended: true
}));

app.use(cors());

// assign server port
app.get('/', (req: Request, res: Response) => {
    res.send("API is working successfully!");
});

// apply routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/flowider', flowiderRoutes);
app.use('/api/v1/place', placeRoutes);
app.use('/api/v1/desk', deskRoutes);
app.use('/api/v1/timeslot', timeslotRoutes);
app.use('/api/v1/booking', bookingRoutes);
app.use('/api/v1/schedule', scheduleRoutes);
// backdoor
app.use('/api/backdoor', backdoorRoutes);
// scheduled function
const MIDNIGHT = "0 0 0 * * *";
const FIFTEEN_SEC = "*/15 * * * * * *";
cron.schedule(MIDNIGHT, async () => {
    await createTimeSlotForAllDesksRoutine();
    // console.log("Running node-cron");
}, {
    timezone: "Asia/Bangkok"
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});