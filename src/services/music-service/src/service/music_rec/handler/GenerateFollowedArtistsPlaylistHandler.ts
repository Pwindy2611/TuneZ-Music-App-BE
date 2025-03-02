import {inject, injectable} from "tsyringe";
import {MusicBaseRepository} from "../../../repository/MusicBaseRepository.js";
import {MusicRecRepository} from "../../../repository/MusicRecRepository.js";
import {GenerateFollowedArtistsPlaylistQuery} from "../query/GenerateFollowedArtistsPlaylistQuery.js";
@injectable()
export class GenerateFollowedArtistsPlaylistHandler {
    constructor(@inject(MusicRecRepository) private musicRepo: MusicRecRepository) {}
    async execute(query: GenerateFollowedArtistsPlaylistQuery) {
        return await this.musicRepo.generateFollowedArtistsPlaylist(query.userId);
    }
}