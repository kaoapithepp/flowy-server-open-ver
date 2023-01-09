import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

const userRoutes =  require('./routes/user.route');
const flowiderRoutes = require('./routes/flowider.route');
const placeRoutes = require('./routes/place.route');

// invoke dependencies
dotenv.config();
const app: Express = express();

// ECONNREFUSED prevention
process.on('uncaughtException', (err) => {
    console.log(err);
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

// apply routes
app.use('/api/user', userRoutes);
app.use('/api/flowider', flowiderRoutes);
app.use('/api/place', placeRoutes);


// assign server port
app.get('/', (req: Request, res: Response) => {
    res.send("API is working successfully!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});