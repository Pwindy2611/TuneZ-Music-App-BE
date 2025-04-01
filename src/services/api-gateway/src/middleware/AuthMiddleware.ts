import { Response, NextFunction } from "express";
import { IAuthRequest } from "../interface/IAuthRequest";
import {auth} from "../config/firebase/FireBaseConfig";


export const authMiddleware = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.session;

    if (token) {
        try {
            const decoded = await auth.verifySessionCookie(token, true);
            req.userId = decoded.uid;
            req.headers["x-user-id"] = decoded.uid;
        } catch (error) {
            console.error("Invalid token:", error);
            res.status(403).json({ message: "Invalid token" });
            return;
        }
    } else {
        console.log("Request without authentication");
    }
    next();
};
