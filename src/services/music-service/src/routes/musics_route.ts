import express from 'express';
import {
    createMusicApi,
    getAllMusicsApi,
    getMusicByArtistApi,
    getMusicByCategoryApi
} from "../controllers/musics_controller.js";

const router = express.Router();

router.post('/create_new_music', createMusicApi);
router.get('/get_all_music', getAllMusicsApi);
router.post('/get_music_by_artist', getMusicByArtistApi);
router.post('/get_music_by_category', getMusicByCategoryApi);

export default router;