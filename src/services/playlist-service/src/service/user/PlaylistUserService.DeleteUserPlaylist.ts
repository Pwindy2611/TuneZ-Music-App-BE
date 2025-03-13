import {IPlaylistUserService} from "../../interface/service/IPlaylistUserService.js";
import {playlistUserRepository} from "../../repository/PlaylistUserRepository.js";

export const deleteUserPlaylist: IPlaylistUserService['deleteUserPlaylist'] = async (userId, playlistId) => {
    try {
        return await playlistUserRepository.deleteUserPlaylist(userId, playlistId);
    }catch (error) {
        throw new Error(`Failed to delete user playlist: ${error.message}`);
    }
}