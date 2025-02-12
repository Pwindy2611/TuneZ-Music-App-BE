import proxy from "express-http-proxy";

export const officialArtistProxy = proxy('http://official-artist-service:3002', {
    proxyReqPathResolver: (req) => {
        const newPath = req.url.replace(/^\/offartist/, '');
        console.log(`[PROXY] Forwarding to official-artist-service: ${newPath}`);
        return newPath;
    },
    proxyReqOptDecorator: (proxyReqOpts, _req) => {
        console.log(`[PROXY] Requesting: ${proxyReqOpts.protocol}//${proxyReqOpts.host}${proxyReqOpts.path}`);
        return proxyReqOpts;
    },
});