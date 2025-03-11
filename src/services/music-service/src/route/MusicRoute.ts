import express from 'express';
import MusicController from "../controller/MusicController.js";

const router = express.Router();

//CURD
router.post('/createNewMusic', MusicController.createMusicApi);
router.post('/uploadMusicByUser', MusicController.uploadMusicByUserApi);

//GET REQUEST
router.get('/getAllMusic', MusicController.getAllMusicsApi);
router.get('/getMusicByArtist', MusicController.getMusicByArtistApi);
router.get('/getMusicByGenres', MusicController.getMusicByGenresApi);
router.get('/getMusicHistory', MusicController.getMusicHistoryApi);
router.get('/getMusicLove', MusicController.getMusicLoveApi);

//STREAM
router.get('/getStreamMusic/:musicId', MusicController.getStreamMusicApi);
router.post('/pauseMusic', MusicController.pauseMusicApi);
router.post('/playMusic/:musicId', MusicController.playMusicApi);
router.post('/seekMusic/:musicId', MusicController.seekMusicApi);
router.get('/getUserMusicState', MusicController.getUserMusicStateApi);

export default router;