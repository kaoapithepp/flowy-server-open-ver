import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// invoke dependencies
dotenv.config();
const app: Express = express();

app.use(express.json({
    limit: "30mb"
}));

app.use(express.urlencoded({
    limit: "30mb",
    extended: true
}));

app.use(cors());

app.get('/', (req: Request, res: Response) => {
    res.send("API is working successfully!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});