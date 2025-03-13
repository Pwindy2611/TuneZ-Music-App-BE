import {IPlaylistUserService} from "../../interface/service/IPlaylistUserService.js";
import {playlistUserRepository} from "../../repository/PlaylistUserRepository.js";

export const getUserPlaylist:IPlaylistUserService['getUserPlaylists'] = async (userId) => {
    try {
        return await playlistUserRepository.getUserPlaylists(userId);
    }catch (error) {
        throw new Error(`Failed to get user playlists: ${error.message}`);
    }
}