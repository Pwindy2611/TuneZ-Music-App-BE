import {IPlaylistBaseService} from "../interface/IPlaylistBaseService.js";
import {IPlaylist} from "../interface/IPlaylist.js";
import {baseRepo} from "../repository/PlaylistBaseRepository.js";

export const createPlaylist: IPlaylistBaseService['createPlaylist'] = async (title, type, value) => {
    try {
        const playlistData: IPlaylist = {
            title,
            type,
            value,
            createdAt: new Date().toISOString(),
        };
        await baseRepo.createPlaylist(playlistData);
    }catch (error) {
        throw new Error(`Failed to create playlist: ${error.message}`);
    }
}