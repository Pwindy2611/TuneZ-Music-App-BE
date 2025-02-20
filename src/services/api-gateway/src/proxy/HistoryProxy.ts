import proxy from "express-http-proxy";

export const historyProxy = proxy('http://history-service:3004', {
    proxyReqPathResolver: (req) => {
        const newPath = req.url.replace(/^\/history/, '');
        console.log(`[PROXY] Forwarding to history-service: ${newPath}`);
        return newPath;
    },
    proxyReqOptDecorator: (proxyReqOpts, _req) => {
        console.log(`[PROXY] Requesting: ${proxyReqOpts.protocol}//${proxyReqOpts.host}${proxyReqOpts.path}`);
        return proxyReqOpts;
    },
    userResDecorator: async (proxyRes, proxyResData, req, res) => {
        // Loại bỏ header CORS từ response của service (nếu có)
        res.removeHeader('access-control-allow-origin');
        // Thêm header CORS hợp lệ cho client
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        console.log(`[PROXY] Response received from history-service: ${proxyRes.statusCode}`);
        try {
            const data = JSON.parse(proxyResData.toString('utf8'));
            return JSON.stringify(data);
        } catch (error) {
            console.error('[PROXY] Failed to parse response:', error);
            return proxyResData;
        }
    },
});
