import express from 'express';
import proxy from 'express-http-proxy';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({ credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Log request method and URL
app.use((req, _res, next) => {
    console.log(`[API Gateway] Request method: ${req.method}`);
    console.log(`[API Gateway] Request path: ${req.url}`);
    next();  // Đảm bảo tiếp tục xử lý tiếp theo
});

// Proxy for /users
app.use(
    '/users',
    proxy('http://user-service:3001', {
        proxyReqPathResolver: (req) => {
            // Loại bỏ "/users" khỏi URL
            const newPath = req.url.replace(/^\/users/, '');
            console.log(`[PROXY] Forwarding to user-service: ${newPath}`);
            return newPath;  // Trả về URL mới đã loại bỏ "/users"
        },
        proxyReqOptDecorator: (proxyReqOpts, _req) => {
            console.log(`[PROXY] Requesting: ${proxyReqOpts.protocol}//${proxyReqOpts.host}${proxyReqOpts.path}`);
            return proxyReqOpts;
        },
    })
);

// Proxy for /musics
app.use(
    '/musics',
    proxy('http://music-service:3002', {
        proxyReqPathResolver: (req) => {
            // Loại bỏ "/musics" khỏi URL
            const newPath = req.url.replace(/^\/musics/, '');
            console.log(`[PROXY] Forwarding to music-service: ${newPath}`);
            return newPath;  // Trả về URL mới đã loại bỏ "/musics"
        },
        proxyReqOptDecorator: (proxyReqOpts, _req) => {
            console.log(`[PROXY] Requesting: ${proxyReqOpts.protocol}//${proxyReqOpts.host}${proxyReqOpts.path}`);
            return proxyReqOpts;
        },
    })
);

// Health check endpoint
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'UP' });
});

// Start the server
app.listen(port, () => {
    console.log(`API Gateway is running on http://localhost:${port}/`);
});
