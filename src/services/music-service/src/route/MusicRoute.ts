import express from 'express';
import MusicController from "../controller/MusicController.js";

const router = express.Router();

//CURD
router.post('/createNewMusic', MusicController.createMusicApi);
router.post('/uploadMusicByUser', MusicController.uploadMusicByUserApi);

//GET REQUEST
router.get('/getAllMusic', MusicController.getAllMusicsApi);
router.post('/getMusicByArtist', MusicController.getMusicByArtistApi);
router.post('/getMusicByCategory', MusicController.getMusicByCategoryApi);
router.post('/getMusicHistory', MusicController.getMusicHistoryApi);
router.post('/getMusicLove', MusicController.getMusicLoveApi)

//GENERATE
router.post('/generateUserPlaylist', MusicController.generateUserPlaylistApi);
router.post('/generateRecentPlaylist', MusicController.generateRecentPlaylistApi);
router.post('/generateThrowBackPlaylist', MusicController.generateThrowBackPlaylistApi);

export default router;