import express from 'express';
import OfficialArtistController from "../controller/OfficialArtistController.js";
import {authMiddleware} from "../util/middleware/AuthMiddleware.js";

const router = express.Router();

//CURD
router.post('/createOfficialArtist', OfficialArtistController.createOfficialArtistApi);
router.put('/updateOfficialArtist/:artistId', OfficialArtistController.updateOfficialArtistApi);
router.delete('/deleteOfficialArtist/:artistId', OfficialArtistController.deleteOfficialArtistApi);

//GET REQUEST
router.get('/getOfficialArtistInfo/:artistId', OfficialArtistController.getOfficialArtistInfoApi);
router.get('/getAllOfficialArtist', authMiddleware, OfficialArtistController.getAllOfficialArtistByUserApi);
router.get('/getAll', OfficialArtistController.getAllOfficialArtistApi);

export default router;