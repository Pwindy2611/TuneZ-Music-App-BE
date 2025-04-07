import {IPlaylistUserService} from "../../interface/service/IPlaylistUserService.js";
import {playlistUserRepository} from "../../repository/PlaylistUserRepository.js";

export const createUserPlaylist: IPlaylistUserService['createUserPlaylist'] = async (userId, title) => {
    try {
        return await playlistUserRepository.createUserPlaylist(userId, title);
    }catch (error) {
        throw new Error(`Failed to create user playlist: ${error.message}`);
    }
}