import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
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

// Proxy configuration
const userServiceProxy = createProxyMiddleware({
    target: 'http://user-service:3001',
    changeOrigin: true,
    pathRewrite: {
        '^/users': '', // remove /users prefix when forwarding to user-service
    },
});

// Routes
app.use('/users', userServiceProxy);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP' });
});

// Start the server
app.listen(port, () => {
    console.log(`API Gateway is running on http://localhost:${port}/`);
});

/// EXAMPLE
// curl -X POST http://localhost:3000/users/register \
// -H "Content-Type: application/json" \
// -d '{
//   "email": "user@example.com",
//   "password": "Password123!",
//   "username": "newuser"
// }'
