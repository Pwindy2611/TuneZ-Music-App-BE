import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import subscriptionRoute from './route/SubscriptionRoute.js';
import 'reflect-metadata';

const app = express();
const port = process.env.PORT || 3009;

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || origin.match(/^https?:\/\/(localhost|tunez-ddb5f\.firebaseapp\.com|api-gateway)(:\d+)?$/)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
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

// Routes
app.use(subscriptionRoute);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        status: 500,
        success: false,
        message: 'Something went wrong!'
    });
});

// Start the server
const server = http.createServer(app);
server.listen(port, () => {
    console.log(`Subscription service is running on http://localhost:${port}/`);
}); 