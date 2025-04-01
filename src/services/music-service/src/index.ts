import 'reflect-metadata';
import './grpc/index.js'
import './config/container/Container.js'
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import musicRoute from './route/MusicRoute.js';
import { envConfig } from './config/EnvConfig.js';

const app = express();
const port = envConfig.getPort();

// Middleware
const allowedOrigins = envConfig.getAllowedOrigins();

app.use(cors({
    origin: false,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));
app.use(compression());
app.use(cookieParser());
<<<<<<< HEAD
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true , limit: '50mb'}));
=======
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
>>>>>>> parent of e345b63 (new api)
app.use((req, _res, next) => {
    console.log(`[Music Api] Request method: ${req.method}, path: ${req.path}`);
    next();
});
// Routes
app.use('/api', musicRoute);

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
    next();
});

// Start the server
const server = http.createServer(app);
server.listen(port, () => {
    console.log(`Music service is running on http://localhost:${port}/`);
});