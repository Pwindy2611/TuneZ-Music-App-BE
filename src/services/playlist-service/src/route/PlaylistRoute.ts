import express from "express";
import PlaylistController from "../controller/PlaylistController.js";

const router = express.Router();

router.post('/createNewPlaylist', PlaylistController.createPlaylistApi);
router.get('/generateUserPlaylist', PlaylistController.generateUserPlaylistApi);
export default router;