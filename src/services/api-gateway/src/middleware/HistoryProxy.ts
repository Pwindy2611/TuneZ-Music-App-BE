import proxy from "express-http-proxy";

export const historyProxy = proxy('http://history-service:3003', {
    proxyReqPathResolver: (req) => {
        const newPath = req.url.replace(/^\/history/, '');
        console.log(`[PROXY] Forwarding to history-service: ${newPath}`);
        return newPath;
    },
    proxyReqOptDecorator: (proxyReqOpts, _req) => {
        console.log(`[PROXY] Requesting: ${proxyReqOpts.protocol}//${proxyReqOpts.host}${proxyReqOpts.path}`);
        return proxyReqOpts;
    },
})