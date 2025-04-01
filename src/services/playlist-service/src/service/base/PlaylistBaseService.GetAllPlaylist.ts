import {IPlaylistBaseService} from "../../interface/service/IPlaylistBaseService.js";
import {baseRepo} from "../../repository/PlaylistBaseRepository.js";

export const getAllPlaylists: IPlaylistBaseService["getAllPlaylists"] = async () => {
    try {
        return baseRepo.getAllPlaylists();
    } catch (error) {
        throw new Error(`Failed to get all playlists: ${error.message}`);
    }
}
