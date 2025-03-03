import {GenerateUserPlaylistService} from './MusicRecService.GenerateUserPlaylist.js'
import {GenerateRecentPlaylistService} from './MusicRecService.GenerateRecentPlaylist.js'
import {GenerateThrowBackPlaylistService} from './MusicRecService.GenerateThrowBackPlaylist.js'
import {GenerateFollowedArtistsPlaylistService} from "./MusicRecService.GenerateFollowedArtistsPlaylist.js";
import {container} from "tsyringe";

export const MusicRecService = {
    generateUserPlaylist: container.resolve(GenerateUserPlaylistService),
    generateRecentPlaylist: container.resolve(GenerateRecentPlaylistService),
    generateThrowBackPlaylist: container.resolve(GenerateThrowBackPlaylistService),
    generateFollowedArtistsPlaylist: container.resolve(GenerateFollowedArtistsPlaylistService)
}