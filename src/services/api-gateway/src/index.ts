import express from 'express';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import {historyProxy} from "./middleware/HistoryProxy";
import {musicProxy} from "./middleware/MusicProxy";
import {userProxy} from "./middleware/UserProxy";
import {loveProxy} from "./middleware/LoveProxy";
import {officialArtistProxy} from "./middleware/OfficialArtistProxy";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
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

// Proxy
app.use('/users', userProxy);

app.use('/musics', musicProxy);

app.use('/history', historyProxy);

app.use('/offartist', officialArtistProxy)

app.use('/love', loveProxy)

// Health check endpoint
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'UP' });
});

// Start the server
app.listen(port, () => {
    console.log(`API Gateway is running on http://localhost:${port}/`);
});
