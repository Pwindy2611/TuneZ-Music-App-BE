import proxy from "express-http-proxy";
import {Request, Response, NextFunction} from "express";
import * as console from "node:console";

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
                proxyReqOpts.headers = {
                    'Content-Type': req.headers['content-type'] || '',
                    'Authorization': req.headers['authorization'] || '',
                    'x-user-id': req.headers['x-user-id'] || '',
                    'Cookie': req.headers['cookie'] || ''
                };
                
                console.log(`[PROXY] Requesting: ${proxyReqOpts.protocol}//${proxyReqOpts.host}${proxyReqOpts.path}`);
                return proxyReqOpts;
            },
            userResDecorator: async (proxyRes: any, proxyResData: any, req: Request, res: Response) => {
                console.log(`[PROXY] Response received from ${serviceUrl}: ${proxyRes.statusCode}`);

                if (proxyRes.headers['set-cookie']) {
                    res.setHeader('set-cookie', proxyRes.headers['set-cookie']);
                }

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

