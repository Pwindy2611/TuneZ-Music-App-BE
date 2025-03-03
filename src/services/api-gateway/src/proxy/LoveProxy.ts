import proxy from "express-http-proxy";

export const loveProxy = proxy('http://love-service:3005', {
    proxyReqPathResolver: (req) => {
        const newPath = req.url.replace(/^\/love/, '');
        console.log(`[PROXY] Forwarding to love-service: ${newPath}`);
        return newPath;
    },
    proxyReqOptDecorator: (proxyReqOpts, _req) => {
        console.log(`[PROXY] Requesting: ${proxyReqOpts.protocol}//${proxyReqOpts.host}${proxyReqOpts.path}`);
        return proxyReqOpts;
    },
    userResDecorator: async (proxyRes, proxyResData, req, res) => {
        res.removeHeader('access-control-allow-origin');
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        console.log(`[PROXY] Response received from love-service: ${proxyRes.statusCode}`);
        try {
            const data = JSON.parse(proxyResData.toString('utf8'));
            return JSON.stringify(data);
        } catch (error) {
            console.error('[PROXY] Failed to parse response:', error);
            return proxyResData;
        }
    },
});
