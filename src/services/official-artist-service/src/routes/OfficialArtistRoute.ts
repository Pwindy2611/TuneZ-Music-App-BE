import express from 'express';
import OfficialArtistController from "../controllers/OfficialArtistController.js";

const router = express.Router();

router.post('/createOfficialArtist', OfficialArtistController.createOfficialArtistApi);

export default router;