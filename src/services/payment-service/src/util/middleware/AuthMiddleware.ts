import { Response, NextFunction } from "express";
import { IAuthRequest } from "../../interface/object/IAuthRequest.js";

export const authMiddleware = (req: IAuthRequest, res: Response, next: NextFunction) => {
    const userId = req.headers["x-user-id"];

    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    req.userId = Array.isArray(userId) ? userId[0] : userId;
    console.log(`[PAYMENT-SERVICE] User ${req.userId} authenticated`);
    next();
};