import express from 'express';
import MusicController from "../controller/MusicController.js";

const router = express.Router();

//CURD
router.post('/createNewMusic', MusicController.createMusicApi);
router.post('/uploadMusicByUser', MusicController.uploadMusicByUserApi);

//GET REQUEST
router.get('/getAllMusic', MusicController.getAllMusicsApi);
router.get('/getMusicByArtist', MusicController.getMusicByArtistApi);
router.get('/getMusicByCategory', MusicController.getMusicByCategoryApi);
router.get('/getMusicHistory', MusicController.getMusicHistoryApi);
router.get('/getMusicLove', MusicController.getMusicLoveApi)

//GENERATE
router.post('/generateUserPlaylist', MusicController.generateUserPlaylistApi);
router.post('/generateRecentPlaylist', MusicController.generateRecentPlaylistApi);
router.post('/generateThrowBackPlaylist', MusicController.generateThrowBackPlaylistApi);
router.post('/generateFollowPlaylist', MusicController.generateFollowedArtistsPlaylistApi);

export default router;