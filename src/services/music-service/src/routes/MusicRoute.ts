import express from 'express';
import {
    createMusicApi,
    getAllMusicsApi,
    getMusicByArtistApi,
    getMusicByCategoryApi
} from "../controllers/MusicController.js";

const router = express.Router();

router.post('/createNewMusic', createMusicApi);
router.get('/getAllMusic', getAllMusicsApi);
router.post('/getMusicByArtist', getMusicByArtistApi);
router.post('/getMusicByCategory', getMusicByCategoryApi);

export default router;