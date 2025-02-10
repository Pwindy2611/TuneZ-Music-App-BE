import express from 'express';
import {createOfficialArtistApi} from "../controllers/OfficialArtistController.js";

const router = express.Router();

router.post('/createOfficialArtist', createOfficialArtistApi);

export default router;