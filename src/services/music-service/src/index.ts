import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import musicRoute from './routes/musics_route.js';

const app = express();
const port = process.env.PORT || 3002; 
// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/musics', musicRoute);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP' });
});

// Start the server
const server = http.createServer(app);
server.listen(port, () => {
    console.log(`Music service is running on http://localhost:${port}/`);
});