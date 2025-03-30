import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import playlistRoute from './route/PlaylistRoute.js';
import 'reflect-metadata';
import './grpc/index.js';
import { envConfig } from './config/EnvConfig.js';

const app = express();
const port = envConfig.getPort();

// Middleware
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = envConfig.getAllowedOrigins();
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(`[Playlist Api] Request method: ${req.method}, path: ${req.path}`);
    next();
});

// Routes
app.use('/api', playlistRoute);

// Health check endpoint
app.get('/health', (req, res) => {
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
    next();
});

// Start the server
const server = http.createServer(app);
server.listen(port, () => {
    console.log(`Playlist service is running on http://localhost:${port}/`);
});