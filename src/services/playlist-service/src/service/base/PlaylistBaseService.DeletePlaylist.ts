import {IPlaylistBaseService} from "../../interface/service/IPlaylistBaseService.js";
import {baseRepo} from "../../repository/PlaylistBaseRepository.js";

export const deletePlaylist: IPlaylistBaseService['deletePlaylist'] = async (id) => {
    try {
        await baseRepo.deletePlaylist(id);
    }catch (error) {
        throw new Error(`Failed to delete playlist: ${error.message}`);
    }
}