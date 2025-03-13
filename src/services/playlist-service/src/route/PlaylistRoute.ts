import express from "express";
import PlaylistController from "../controller/PlaylistController.js";

const router = express.Router();

//SYSTEM
router.post('/createNewPlaylist', PlaylistController.createPlaylistApi);
router.post('/updatePlaylist', PlaylistController.updatePlaylistApi);
router.get('/generatePlaylist', PlaylistController.generatePlaylistApi);


//USER
router.post('/createUserPlaylist', PlaylistController.createUserPlaylistApi);
router.post('/updateUserPlaylist', PlaylistController.updateUserPlaylistApi);
router.delete('/deleteUserPlaylist', PlaylistController.deleteUserPlaylistApi);
router.get('/getUserPlaylists', PlaylistController.getUserPlaylistsApi);
router.post('/addMusic', PlaylistController.addMusicToUserPlaylistApi);
router.post('/removeMusic', PlaylistController.removeMusicFromUserPlaylistApi);
export default router;