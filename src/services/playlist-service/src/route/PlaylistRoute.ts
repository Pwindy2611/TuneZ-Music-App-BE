import express from "express";
import PlaylistController from "../controller/PlaylistController.js";
import {authMiddleware} from "../util/middleware/AuthMiddleware.js";

const router = express.Router();

//SYSTEM
router.post('/createNewPlaylist', PlaylistController.createPlaylistApi);
router.post('/updatePlaylist', PlaylistController.updatePlaylistApi);
router.delete('/deletePlaylist', PlaylistController.deletePlaylistApi);
router.get('/getAllPlaylist', PlaylistController.getAllPlaylistsApi);
router.get('/generatePlaylist', authMiddleware, PlaylistController.generatePlaylistApi);


//USER
router.post('/createUserPlaylist', authMiddleware, PlaylistController.createUserPlaylistApi);
router.post('/updateUserPlaylist', authMiddleware, PlaylistController.updateUserPlaylistApi);
router.delete('/deleteUserPlaylist', authMiddleware, PlaylistController.deleteUserPlaylistApi);
router.get('/getUserPlaylists', authMiddleware, PlaylistController.getUserPlaylistsApi);
router.post('/addMusic', authMiddleware, PlaylistController.addMusicToUserPlaylistApi);
router.post('/removeMusic', authMiddleware, PlaylistController.removeMusicFromUserPlaylistApi);
export default router;