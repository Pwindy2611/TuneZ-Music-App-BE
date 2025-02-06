import express from 'express';
import {
    createMusicApi,
    getAllMusicsApi,
    getMusicByArtistApi,
    getMusicByCategoryApi,
    getMusicHistoryApi,
    generateUserPlaylistApi
} from "../controllers/MusicController.js";

const router = express.Router();

router.post('/createNewMusic', createMusicApi);
router.get('/getAllMusic', getAllMusicsApi);
router.post('/getMusicByArtist', getMusicByArtistApi);
router.post('/getMusicByCategory', getMusicByCategoryApi);
router.post('/getMusicHistory', getMusicHistoryApi);
router.post('/generateUserPlaylist', generateUserPlaylistApi);

export default router;