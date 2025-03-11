import express from "express";
import PlaylistController from "../controller/PlaylistController.js";

const router = express.Router();

router.post('/createNewPlaylist', PlaylistController.createPlaylistApi);
router.post('/updatePlaylist', PlaylistController.updatePlaylistApi);
router.get('/generatePlaylist', PlaylistController.generatePlaylistApi);
export default router;