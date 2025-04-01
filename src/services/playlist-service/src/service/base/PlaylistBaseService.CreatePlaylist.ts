import {IPlaylistBaseService} from "../../interface/service/IPlaylistBaseService.js";
import {baseRepo} from "../../repository/PlaylistBaseRepository.js";

export const createPlaylist: IPlaylistBaseService['createPlaylist'] = async (playlist, imgFile) => {
    try {
        await baseRepo.createPlaylist(playlist, imgFile);
    }catch (error) {
        throw new Error(`Failed to create playlist: ${error.message}`);
    }
}