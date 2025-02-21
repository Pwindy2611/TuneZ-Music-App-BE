import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import musicRoute from './route/MusicRoute.js';
import 'reflect-metadata';

const app = express();
const port = process.env.PORT || 3003; 
// Middleware
app.use(cors({
    origin: 'http://api-gateway:3000',
    credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(`[Music Api] Request method: ${req.method}, path: ${req.path}`);
    next();
});
// Routes
app.use(musicRoute);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP' });
});

// Start the server
const server = http.createServer(app);
server.listen(port, () => {
    console.log(`Music service is running on http://localhost:${port}/`);
});