import proxy from "express-http-proxy";

export const loveProxy = proxy('http://love-service:3005', {
    proxyReqPathResolver: (req) => {
        const newPath = req.url.replace(/^\/love/, '');
        console.log(`[PROXY] Forwarding to history-service: ${newPath}`);
        return newPath;
    },
    proxyReqOptDecorator: (proxyReqOpts, _req) => {
        console.log(`[PROXY] Requesting: ${proxyReqOpts.protocol}//${proxyReqOpts.host}${proxyReqOpts.path}`);
        return proxyReqOpts;
    },
})