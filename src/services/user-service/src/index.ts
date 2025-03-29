import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import userRoute from './route/UserRoute.js';
import dotenv from 'dotenv';
import './grpc/index.js'

dotenv.config();

const app = express();
const port = process.env.PORT || 3001; 

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) {
            callback(null, true);
            return;
        }
        
        const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-user-id']
}));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(`[User Api] Request method: ${req.method}, path: ${req.path}`);
    next();
});
// Routes
app.use('/api', userRoute);

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
const server = http.createServer(app);
server.listen(port, () => {
    console.log(`User service is running on http://localhost:${port}/`);
});