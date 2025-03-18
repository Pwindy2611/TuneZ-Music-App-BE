import express from 'express';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { Request, Response, NextFunction } from "express";


import {
    /*followProxy,
    historyProxy,
    loveProxy,
    musicProxy,
    officialArtistProxy,
    playlistProxy,
    userProxy,
    albumProxy,
    subscriptionProxy,*/
    createProxy
} from "./proxy/CreateProxy";
import {authMiddleware} from "./middleware/AuthMiddleware";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
const allowedOrigins = [
    'https://tunez-ddb5f.firebaseapp.com',
    'https://localhost:3000'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie'],
}));


/*const options = {
    key: fs.readFileSync(process.env.SERVER_KEY_PATH || '../server.key'),
    cert: fs.readFileSync(process.env.SERVER_CERT_PATH || '../server.cert')
};*/

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
const serviceMap: Record<string, string> = {
    users: "http://user-service:3001",
    musics: "http://music-service:3002",
    history: "http://history-service:3003",
    playlists: "http://playlist-service:3007",
    albums: "http://album-service:3008",
    love: "http://love-service:3009",
    follow: "http://follow-service:3010",
    subscriptions: "http://subscription-service:3011"
};
app.use(
    "/api/:service",
    authMiddleware,
    (req: Request, res: Response, next: NextFunction) => {
        const service = req.params.service;
        const serviceUrl = serviceMap[service];

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

// Start the server
/*
https.createServer(options, app).listen(3000, () => {
    console.log(`Api gateway running on https://localhost:${port}`);
});
*/

app.listen(port, () => {
    console.log(`Api gateway running on http://localhost:${port}`);
});