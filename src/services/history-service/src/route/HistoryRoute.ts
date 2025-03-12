import express from 'express';
import HistoryController from "../controller/HistoryController";

const router = express.Router();

router.post('/saveHistory', HistoryController.saveHistoryApi);

router.get('/getMusicIdsByUserHistory', HistoryController.getMusicIdsFromUserHistoryApi)
export default router;