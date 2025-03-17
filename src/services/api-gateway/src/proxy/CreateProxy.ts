import proxy from "express-http-proxy";
import { Request, Response, NextFunction } from "express";
import * as console from "node:console";

const allowedOrigins = [
    'https://tunez-ddb5f.firebaseapp.com',
    'http://localhost:3000'
];

const createProxy = (serviceUrl: string, pathPrefix: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const contentType = req.headers['content-type'] || '';

        const proxyOptions: any = {
            proxyReqPathResolver: (req: Request) => {
                const newPath = req.url.replace(new RegExp(`^/${pathPrefix}`), '');
                console.log(`[PROXY] Forwarding to ${serviceUrl}: ${newPath}`);
                return newPath;
            },
            proxyReqOptDecorator: (proxyReqOpts: any, req: Request) => {
                proxyReqOpts.headers = proxyReqOpts.headers || {};
                proxyReqOpts.headers['Content-Type'] = req.headers['content-type'] || '';
                proxyReqOpts.headers["x-user-id"] = req.headers["x-user-id"] || '';
                proxyReqOpts.credentials = "include";
                console.log(`[PROXY] Requesting: ${proxyReqOpts.protocol}//${proxyReqOpts.host}${proxyReqOpts.path}`);
                return proxyReqOpts;
            },
            userResDecorator: async (proxyRes: any, proxyResData: any, req: Request, res: Response) => {
                console.log(`[PROXY] Response received from ${serviceUrl}: ${proxyRes.statusCode}`);

                const origin = req.headers.origin || "";
                if (!origin || allowedOrigins.includes(origin)) {
                    res.header("Access-Control-Allow-Origin", origin || "*");
                } else {
                    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
                }
                res.header("Access-Control-Allow-Credentials", "true");
                res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
                res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Set-Cookie");

                const resContentType = proxyRes.headers["content-type"] || "";
                if (resContentType.startsWith("audio/")) {
                    return proxyResData;
                }

                if (resContentType.includes("application/json")) {
                    try {
                        const responseBody = proxyResData.toString("utf8").replace(/^\uFEFF/, "");
                        return JSON.stringify(JSON.parse(responseBody));
                    } catch (error) {
                        console.error("[PROXY] Failed to parse JSON response:", error);
                        return proxyResData;
                    }
                }
                return proxyResData;
            }
        };

        if (contentType.includes('multipart/form-data')) {
            proxyOptions.parseReqBody = false;
        }

        proxy(serviceUrl, proxyOptions)(req, res, next);
    };
};

export const followProxy = createProxy('http://follow-service:3006', 'follow');
export const historyProxy = createProxy('http://history-service:3004', 'history');
export const loveProxy = createProxy('http://love-service:3005', 'love');
export const musicProxy = createProxy('http://music-service:3003', 'musics');
export const officialArtistProxy = createProxy('http://official-artist-service:3002', 'offartist');
export const playlistProxy = createProxy('http://playlist-service:3007', 'playlists');
export const userProxy = createProxy('http://user-service:3001', 'users');
export const albumProxy = createProxy('http://album-service:3008', 'albums');