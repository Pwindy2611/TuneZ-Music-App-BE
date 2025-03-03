import express from 'express';
import OfficialArtistController from "../controller/OfficialArtistController.js";

const router = express.Router();

router.post('/createOfficialArtist', OfficialArtistController.createOfficialArtistApi);
router.get('/getAllOfficialArtist', OfficialArtistController.getAllOfficialArtistApi);
export default router;