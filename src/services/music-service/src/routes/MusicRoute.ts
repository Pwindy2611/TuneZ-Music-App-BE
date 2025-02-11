import express from 'express';
import {
    createMusicApi,
    uploadMusicByUserApi,
    getAllMusicsApi,
    getMusicByArtistApi,
    getMusicByCategoryApi,
    getMusicHistoryApi,
    generateUserPlaylistApi,
    generateRecentPlaylistApi
} from "../controllers/MusicController.js";

const router = express.Router();

//CURD
router.post('/createNewMusic', createMusicApi);
router.post('/uploadMusicByUser', uploadMusicByUserApi);

//GET REQUEST
router.get('/getAllMusic', getAllMusicsApi);
router.post('/getMusicByArtist', getMusicByArtistApi);
router.post('/getMusicByCategory', getMusicByCategoryApi);
router.post('/getMusicHistory', getMusicHistoryApi);

//GENERATE
router.post('/generateUserPlaylist', generateUserPlaylistApi);
router.post('/generateRecentPlaylist', generateRecentPlaylistApi);

export default router;