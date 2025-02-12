import proxy from "express-http-proxy";
import { Request, Response, NextFunction } from "express-serve-static-core";
export const musicProxy = (req: Request, res: Response, next: NextFunction) => {
    const contentType = req.headers['content-type'] || '';
    console.log('Content-Type:', contentType);

    if (contentType.includes('multipart/form-data')) {
        proxy('http://music-service:3003', {
            parseReqBody: false,
            proxyReqPathResolver: (req) => {
                const newPath = req.url.replace(/^\/musics/, '');
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
        proxy('http://music-service:3003', {
            proxyReqPathResolver: (req) => {
                const newPath = req.url.replace(/^\/musics/, '');
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