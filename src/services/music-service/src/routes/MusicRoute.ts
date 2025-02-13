import express from 'express';
import {
    createMusicApi,
    uploadMusicByUserApi,
    getAllMusicsApi,
    getMusicByArtistApi,
    getMusicByCategoryApi,
    getMusicHistoryApi,
    getMusicLoveApi,
    generateUserPlaylistApi,
    generateRecentPlaylistApi, 
    generateThrowBackPlaylistApi
} from "../controllers/MusicController.js";
import {getMusicLove} from "../services/MusicBaseService.GetMusicLove.js";

const router = express.Router();

//CURD
router.post('/createNewMusic', createMusicApi);
router.post('/uploadMusicByUser', uploadMusicByUserApi);

//GET REQUEST
router.get('/getAllMusic', getAllMusicsApi);
router.post('/getMusicByArtist', getMusicByArtistApi);
router.post('/getMusicByCategory', getMusicByCategoryApi);
router.post('/getMusicHistory', getMusicHistoryApi);
router.post('/getMusicLove', getMusicLoveApi)

//GENERATE
router.post('/generateUserPlaylist', generateUserPlaylistApi);
router.post('/generateRecentPlaylist', generateRecentPlaylistApi);
router.post('/generateThrowBackPlaylist', generateThrowBackPlaylistApi);
export default router;