import express from 'express';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { Request, Response, NextFunction } from "express";
import { createHttpsServer } from './config/https/HttpsConfig.js';
import { envConfig } from './config/EnvConfig.js';

import {
    createProxy
} from "./proxy/CreateProxy";
import {authMiddleware} from "./middleware/AuthMiddleware";

const app = express();
const port = envConfig.getPort();

// Middleware
const allowedOrigins = envConfig.getAllowedOrigins();

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie'],
}));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Log request method and URL
app.use((req, _res, next) => {
    console.log(`[API Gateway] Request method: ${req.method}`);
    console.log(`[API Gateway] Request path: ${req.url}`);
    next(); 
});

// Service URLs from environment variables
const serviceUrls = envConfig.getServiceUrls();

app.use(
    "/api/:service",
    authMiddleware,
    (req: Request, res: Response, next: NextFunction) => {
        const service = req.params.service;
        const serviceUrl = serviceUrls[service];

        if (!serviceUrl) {
            res.status(404).json({ error: "Service not found" });
            return;
        }

        const proxyMiddleware = createProxy(serviceUrl, service);
        proxyMiddleware(req, res, next);
    }
);

// Health check endpoint
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'UP' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    res.status(500).json({
        status: 500,
        success: false,
        message: err.message || 'Something went wrong!'
    });
});

// Start the server
app.listen(port, () => {
     console.log(`API Gateway running on http://localhost:${port}`);
});

// Code HTTPS được giữ lại để sau này dùng
/*const server = createHttpsServer(app);
server.listen(port, () => {
    console.log(`API Gateway running on https://localhost:${port}`);
});*/
