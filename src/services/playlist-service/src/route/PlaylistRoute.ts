import express from "express";
import PlaylistController from "../controller/PlaylistController.js";

const router = express.Router();

router.post('/createNewPlaylist', PlaylistController.createPlaylistApi);
/*router.get('/generateUserPlaylist', PlaylistController.generateUserPlaylistApi);
router.get('/generateRecentPlaylist', PlaylistController.generateRecentPlaylistApi);
router.get('/generateThrowbackPlaylist', PlaylistController.generateThrowBackPlaylistApi);
router.get('/getFollowedArtistsPlaylist', PlaylistController.generateFollowedArtistsPlaylistApi);*/
router.get('/generatePlaylist', PlaylistController.generatePlaylistApi);
export default router;