import proxy from 'express-http-proxy';

export const userProxy = 
    proxy('http://user-service:3001', {
            proxyReqPathResolver: (req) => {
                const newPath = req.url.replace(/^\/users/, '');
                console.log(`[PROXY] Forwarding to user-service: ${newPath}`);
                return newPath;
            },
            proxyReqOptDecorator: (proxyReqOpts, _req) => {
                console.log(`[PROXY] Requesting: ${proxyReqOpts.protocol}//${proxyReqOpts.host}${proxyReqOpts.path}`);
                return proxyReqOpts;
            },
    })