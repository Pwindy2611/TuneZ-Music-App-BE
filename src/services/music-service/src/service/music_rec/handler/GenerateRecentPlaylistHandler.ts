import {inject, injectable} from "tsyringe";
import {MusicRecRepository} from "../../../repository/MusicRecRepository.js";
import {GenerateRecentPlaylistQuery} from "../query/GenerateRecentPlaylistQuery.js";
@injectable()
export class GenerateRecentPlaylistHandler {
    constructor(@inject(MusicRecRepository) private musicRepo: MusicRecRepository) {}
    async execute(query: GenerateRecentPlaylistQuery) {
        return await this.musicRepo.generateRecentPlaylist(query.userId, query.playlistLimit, query.historyLimit)
    }
}