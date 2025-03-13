import {IPlaylistUserService} from "../../interface/service/IPlaylistUserService.js";
import {playlistUserRepository} from "../../repository/PlaylistUserRepository.js";

export const addMusicToUserPlaylist: IPlaylistUserService['addMusicToUserPlaylist'] = async (userId, playlistId, musicId) => {
    try {
        const playlist = await playlistUserRepository.getUserPlaylistById(userId, playlistId);
        if (!playlist) {
            return Promise.reject(new Error('Playlist not found'));
        }
        await playlistUserRepository.addMusicToUserPlaylist(userId, playlistId, musicId);
    } catch (error) {
        throw new Error(`Failed to add music to user playlist: ${error.message}`);
    }
}