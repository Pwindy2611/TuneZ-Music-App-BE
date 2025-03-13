import {IPlaylistUserService} from "../../interface/service/IPlaylistUserService.js";
import {playlistUserRepository} from "../../repository/PlaylistUserRepository.js";

export const removeMusicFromUserPlaylist:IPlaylistUserService['removeMusicFromUserPlaylist'] = async (userId, playlistId, musicIds) => {
    try {
        return await playlistUserRepository.removeMusicFromUserPlaylist(userId, playlistId, musicIds);
    }catch (error) {
        throw new Error(`Failed to remove music from user playlist: ${error.message}`);
    }
}