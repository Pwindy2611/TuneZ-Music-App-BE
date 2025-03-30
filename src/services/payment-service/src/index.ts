import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import { envConfig } from './config/EnvConfig.js';

import paymentRoute from './route/PaymentRoute.js';

const app = express();
const port = envConfig.getPort();

// Middleware
app.use(cors({
    origin: false,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req: express.Request, _res: express.Response, next: express.NextFunction) => {
    console.log(`[Payment Api] Request method: ${req.method}, path: ${req.url}`);
    next();
});

// Routes
app.use('/api', paymentRoute);

// Health check endpoint
app.get('/health', (_req: express.Request, res: express.Response) => {
    res.status(200).json({ status: 'UP' });
});

// Start the server
const server = http.createServer(app);
server.listen(port, () => {
    console.log(`Payment service is running on http://localhost:${port}/`);
});
