import express from "express";
import LoveController from "../controllers/LoveController";

const router = express.Router();

router.post('/saveLoveMusic', LoveController.saveLoveMusicApi);

export default router;