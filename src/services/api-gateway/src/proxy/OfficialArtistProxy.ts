import proxy from "express-http-proxy";
import { NextFunction, Request, Response } from "express-serve-static-core";

export const officialArtistProxy = (req: Request, res: Response, next: NextFunction) => {
    const contentType = req.headers['content-type'] || '';
    console.log('Content-Type:', contentType);

    const proxyOptions: any = {
        proxyReqPathResolver: (req: Request) => {
            const newPath = req.url.replace(/^\/offartist/, '');
            console.log(`[PROXY] Forwarding to official-artist-service: ${newPath}`);
            return newPath;
        },
        proxyReqOptDecorator: (proxyReqOpts: any, req: Request) => {
            proxyReqOpts.headers = proxyReqOpts.headers || {};
            proxyReqOpts.headers['Content-Type'] = req.headers['content-type'] || '';
            console.log(`[PROXY] Requesting: ${proxyReqOpts.protocol}//${proxyReqOpts.host}${proxyReqOpts.path}`);
            return proxyReqOpts;
        },
        userResDecorator: async (proxyRes: any, proxyResData: any, req: Request, res: Response) => {
            res.removeHeader('access-control-allow-origin');
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

            console.log(`[PROXY] Response received from official-artist-service: ${proxyRes.statusCode}`);
            try {
                const data = JSON.parse(proxyResData.toString('utf8'));
                return JSON.stringify(data);
            } catch (error) {
                console.error('[PROXY] Failed to parse response:', error);
                return proxyResData;
            }
        }
    };

    if (contentType.includes('multipart/form-data')) {
        proxyOptions.parseReqBody = false;
    }

    proxy('http://official-artist-service:3002', proxyOptions)(req, res, next);
};
