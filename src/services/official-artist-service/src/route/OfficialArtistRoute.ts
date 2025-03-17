import express from 'express';
import OfficialArtistController from "../controller/OfficialArtistController.js";
import {authMiddleware} from "../util/middleware/AuthMiddleware.js";

const router = express.Router();

router.post('/createOfficialArtist', OfficialArtistController.createOfficialArtistApi);
router.put('/updateOfficialArtist/:artistId', OfficialArtistController.updateOfficialArtistApi);
router.delete('/deleteOfficialArtist/:artistId', OfficialArtistController.deleteOfficialArtistApi);
router.get('/getOfficialArtistInfo/:artistId', OfficialArtistController.getOfficialArtistInfoApi);
router.get('/getAllOfficialArtist', authMiddleware, OfficialArtistController.getAllOfficialArtistApi);

export default router;