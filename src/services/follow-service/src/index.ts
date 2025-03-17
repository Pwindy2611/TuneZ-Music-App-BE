import express from 'express';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import 'reflect-metadata';
import './grpc/index'
import FollowRoute from "./route/FollowRoute";

const app = express();
const port = process.env.PORT || 3006;

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || origin.match(/^https?:\/\/(localhost|tunez-ddb5f\.firebaseapp\.com|api-gateway)(:\d+)?$/)) {
            callback(null, true); // Cho phép Mobile App, Web App hợp lệ và API Gateway
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(`[Follow Api] Request method: ${req.method}, path: ${req.path}`);
    next();
});
//Route
app.use(FollowRoute);

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
    console.log(`Follow service is running on http://localhost:${port}/`);
});
