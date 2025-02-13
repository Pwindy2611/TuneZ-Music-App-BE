import express from "express";
import {saveLoveMusicApi} from "../controllers/LoveController";

const router = express.Router();

router.post("/saveLoveMusic", saveLoveMusicApi);

export default router;