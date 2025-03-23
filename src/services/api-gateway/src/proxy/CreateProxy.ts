import proxy from "express-http-proxy";
import {Request, Response, NextFunction} from "express";
import * as console from "node:console";

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

export const createProxy = (serviceUrl: string, pathPrefix: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const contentType = req.headers['content-type'] || '';

        const proxyOptions: any = {
            proxyReqPathResolver: (req: Request) => {
                const newPath = '/api' + req.url.replace(new RegExp(`^/${pathPrefix}`), "");
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
                    res.header("Access-Control-Allow-Origin", "");
                }
                res.header("Access-Control-Allow-Credentials", "true");
                res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
                res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Set-Cookie");

                const resContentType = proxyRes.headers["content-type"] || "";
                if (resContentType.startsWith("audio/")) {
                    return proxyResData;
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

