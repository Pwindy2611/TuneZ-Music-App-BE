import proxy from "express-http-proxy";
import {NextFunction, Request, Response} from "express-serve-static-core";

export const officialArtistProxy = (req: Request, res: Response, next: NextFunction) => {
    const contentType = req.headers['content-type'] || '';
    console.log('Content-Type:', contentType);

    if (contentType.includes('multipart/form-data')) {
        proxy('http://official-artist-service:3002', {
            parseReqBody: false,
            proxyReqPathResolver: (req) => {
                const newPath = req.url.replace(/^\/offartist/, '');
                console.log(`[PROXY] Forwarding to music-service: ${newPath}`);
                return newPath;
            },
            proxyReqOptDecorator: (proxyReqOpts, req) => {
                proxyReqOpts.headers = proxyReqOpts.headers || {};
                proxyReqOpts.headers['Content-Type'] = req.headers['content-type'] || '';
                console.log(`[PROXY] Requesting: ${proxyReqOpts.protocol}//${proxyReqOpts.host}${proxyReqOpts.path}`);
                return proxyReqOpts;
            },
        })(req, res, next);
    } else {
        proxy('http://official-artist-service:3002', {
            proxyReqPathResolver: (req) => {
                const newPath = req.url.replace(/^\/offartist/, '');
                console.log(`[PROXY] Forwarding to music-service: ${newPath}`);
                return newPath;
            },
            proxyReqOptDecorator: (proxyReqOpts, req) => {
                proxyReqOpts.headers = proxyReqOpts.headers || {};
                proxyReqOpts.headers['Content-Type'] = req.headers['content-type'] || '';
                console.log(`[PROXY] Requesting: ${proxyReqOpts.protocol}//${proxyReqOpts.host}${proxyReqOpts.path}`);
                return proxyReqOpts;
            },
        })(req, res, next);
    }
}