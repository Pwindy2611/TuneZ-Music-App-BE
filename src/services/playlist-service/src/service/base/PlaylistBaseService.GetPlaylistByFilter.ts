import {IPlaylistBaseService} from "../../interface/IPlaylistBaseService.js";
import {baseRepo} from "../../repository/PlaylistBaseRepository.js";

export const getPlaylistByFilter: IPlaylistBaseService["getPlaylistByFilter"] = async (values, type) => {
    try {
        return baseRepo.getPlaylistByFilter(values, type);
    } catch (error) {
        throw new Error(`Failed to get playlist: ${error.message}`);
    }
}