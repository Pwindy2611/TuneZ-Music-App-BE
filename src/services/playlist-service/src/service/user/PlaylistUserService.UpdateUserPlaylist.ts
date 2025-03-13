import {IPlaylistUserService} from "../../interface/service/IPlaylistUserService.js";
import {playlistUserRepository} from "../../repository/PlaylistUserRepository.js";

export const updateUserPlaylist: IPlaylistUserService['updateUserPlaylist'] = async (userId, playlistId, playlist, coverImage) => {
    try {
        await playlistUserRepository.updateUserPlaylist(userId, playlistId, playlist, coverImage);
    }catch (error) {
        throw new Error(`Failed to update user playlist: ${error.message}`);
    }
}