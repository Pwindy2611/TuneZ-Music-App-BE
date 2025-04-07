import {IPlaylistBaseService} from "../../interface/service/IPlaylistBaseService.js";
import {baseRepo} from "../../repository/PlaylistBaseRepository.js";

export const updatePlaylist: IPlaylistBaseService['updatePlaylist'] = async (id, playlist, imgFile) => {
    try {
        await baseRepo.updatePlaylist(id, playlist, imgFile);
    }catch (error) {
        throw new Error(`Failed to update playlist: ${error.message}`);
    }
}