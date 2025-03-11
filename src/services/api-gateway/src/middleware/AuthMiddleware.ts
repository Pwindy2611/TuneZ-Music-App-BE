import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IAuthRequest } from "../interface/IAuthRequest";
import {auth} from "../config/firebase/FireBaseConfig"; // Import interface


export const authMiddleware = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.session; // Lấy token từ cookie.session

    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {
        const decoded = await auth.verifySessionCookie(token, true);
        req.userId = decoded.uid; // Gán userId vào req

        req.headers["x-user-id"] = decoded.uid;

        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid token" });
    }
};
