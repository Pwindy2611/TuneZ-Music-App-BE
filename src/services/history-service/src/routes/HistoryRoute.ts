import express from 'express';
import {
    saveHistoryApi
} from "../controllers/HistoryController";

const router = express.Router();

router.post('/saveHistory', saveHistoryApi);

export default router;