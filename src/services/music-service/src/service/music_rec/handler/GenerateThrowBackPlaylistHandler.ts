import {inject, injectable} from "tsyringe";
import {MusicRecRepository} from "../../../repository/MusicRecRepository.js";
import {GenerateRecentPlaylistQuery} from "../query/GenerateRecentPlaylistQuery.js";
import {GenerateThrowBackPlaylistQuery} from "../query/GenerateThrowBackPlaylistQuery.js";
@injectable()
export class GenerateThrowBackPlaylistHandler {
    constructor(@inject(MusicRecRepository) private musicRepo: MusicRecRepository) {}
    async execute(query: GenerateThrowBackPlaylistQuery) {
        return await this.musicRepo.generateRecentPlaylist(query.userId, query.playlistLimit, query.historyLimit)
    }
}