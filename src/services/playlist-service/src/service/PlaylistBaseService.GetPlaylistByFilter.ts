import {IPlaylistBaseService} from "../interface/IPlaylistBaseService.js";
import {baseRepo} from "../repository/PlaylistBaseRepository.js";

export const getPlaylistByFilter: IPlaylistBaseService["getPlaylistByFilter"] = async (key, values) => {
    try {
        return baseRepo.getPlaylistByFilter(key, values);
    } catch (error) {
        throw new Error(`Failed to get playlist by ${key}: ${error.message}`);
    }
}