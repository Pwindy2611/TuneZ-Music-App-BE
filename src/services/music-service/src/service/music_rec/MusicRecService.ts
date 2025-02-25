import {generateUserPlaylist} from './MusicRecService.GenerateUserPlaylist.js'
import {generateRecentPlaylist} from './MusicRecService.GenerateRecentPlaylist.js'
import {generateThrowBackPlaylist} from './MusicRecService.GenerateThrowBackPlaylist.js'
import {generateFollowedArtistsPlaylist} from "./MusicRecService.GenerateFollowedArtistsPlaylist.js";

export const MusicRecService = {
    generateUserPlaylist,
    generateRecentPlaylist,
    generateThrowBackPlaylist,
    generateFollowedArtistsPlaylist
}