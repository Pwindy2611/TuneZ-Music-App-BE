import express from 'express';
import HistoryController from "../controllers/HistoryController";

const router = express.Router();

router.post('/saveHistory', HistoryController.saveHistoryApi);

export default router;