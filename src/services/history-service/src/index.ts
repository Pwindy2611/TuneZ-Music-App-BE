import express from 'express';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import 'reflect-metadata';
import HistoryRoute from "./route/HistoryRoute";

const app = express();
const port = process.env.PORT || 3004;

// Middleware
app.use(cors({
    origin: 'http://api-gateway:3000',
    credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Route
app.use(HistoryRoute);

// Health check endpoint
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'UP' });
});

// Start the server
app.listen(port, () => {
    console.log(`History service is running on http://localhost:${port}/`);
});
