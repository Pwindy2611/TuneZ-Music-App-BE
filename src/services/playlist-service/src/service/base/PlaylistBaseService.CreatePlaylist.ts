import {IPlaylistBaseService} from "../../interface/service/IPlaylistBaseService.js";
import {baseRepo} from "../../repository/PlaylistBaseRepository.js";

export const createPlaylist: IPlaylistBaseService['createPlaylist'] = async (playlist) => {
    try {
        playlist.createdAt = new Date().toISOString();

        await baseRepo.createPlaylist(playlist);
    }catch (error) {
        throw new Error(`Failed to create playlist: ${error.message}`);
    }
}