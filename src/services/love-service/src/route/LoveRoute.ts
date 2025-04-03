import express from "express";
import LoveController from "../controller/LoveController.js";
import {authMiddleware} from "../util/middleware/AuthMiddleware.js";

const router = express.Router();

router.post('/saveLoveMusic', authMiddleware, LoveController.saveLoveMusicApi);
router.delete('/unLoveMusic/:musicId', authMiddleware, LoveController.unLoveMusicApi);

//MICROSERVICE
router.get('/getMusicIdsByUserLove', LoveController.getMusicIdsByUserLoveApi);
export default router;