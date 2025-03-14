import express from 'express';
import OfficialArtistController from "../controller/OfficialArtistController.js";
import {authMiddleware} from "../util/middleware/AuthMiddleware.js";

const router = express.Router();

router.post('/createOfficialArtist', OfficialArtistController.createOfficialArtistApi);
router.get('/getAllOfficialArtist', authMiddleware, OfficialArtistController.getAllOfficialArtistApi);
export default router;