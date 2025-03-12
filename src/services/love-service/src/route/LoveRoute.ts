import express from "express";
import LoveController from "../controller/LoveController";

const router = express.Router();

router.post('/saveLoveMusic', LoveController.saveLoveMusicApi);
router.get('/getMusicIdsByUserLove', LoveController.getMusicIdsByUserLoveApi);
export default router;