import express from 'express';
import HistoryController from "../controller/HistoryController";
import {authMiddleware} from "../util/middleware/AuthMiddleware";

const router = express.Router();

router.post('/saveHistory', authMiddleware, HistoryController.saveHistoryApi);

router.get('/getMusicIdsByUserHistory', authMiddleware, HistoryController.getMusicIdsFromUserHistoryApi)
export default router;