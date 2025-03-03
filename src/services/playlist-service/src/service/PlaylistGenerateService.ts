import {generateUserPlaylist} from "./PlaylistGenerateService.GenerateUserPlaylist.js";
import {generateRecentPlaylist} from "./PlaylistGenerateService.GenerateRecentPlaylist.js";
import {generateThrowBackPlaylist} from "./PlaylistGenerateService.GenerateThrowBackPlaylist.js";
import {generateFollowedArtistsPlaylist} from "./PlaylistGenerateService.GenerateFollowedArtistsPlaylist.js";

export const PlaylistGenerateService = {
    generateUserPlaylist,
    generateRecentPlaylist,
    generateThrowBackPlaylist,
    generateFollowedArtistsPlaylist
}