import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import loveRoute from "./route/LoveRoute.js";
import './grpc/index'
import { envConfig } from './config/EnvConfig.js';

const app = express();
const port = envConfig.getPort();

// Middleware
const allowedOrigins = envConfig.getAllowedOrigins();

app.use(cors({
    origin: false, // Không cho phép CORS vì chỉ nhận request từ API Gateway
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, _res, next) => {
    console.log(`[Love Api] Request method: ${req.method}, path: ${req.path}`);
    next();
});
// Routes
app.use('/api',loveRoute);

// Health check endpoint
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'UP' });
});

// Start the server
const server = http.createServer(app);
server.listen(port, () => {
    console.log(`Love service is running on http://localhost:${port}/`);
});