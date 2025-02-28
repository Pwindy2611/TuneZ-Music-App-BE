import {inject, injectable} from "tsyringe";
import {MusicRecRepository} from "../../../repository/MusicRecRepository.js";
import {GenerateUserPlaylistQuery} from "../query/GenerateUserPlaylistQuery.js";
@injectable()
export class GenerateUserPlaylistHandler {
    constructor(@inject(MusicRecRepository) private musicRepo: MusicRecRepository) {}

    async execute(query: GenerateUserPlaylistQuery) {
        return await this.musicRepo.generateUserPlaylist(query.userId);
    }
}