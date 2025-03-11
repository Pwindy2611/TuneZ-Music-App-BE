import {inject, injectable} from "tsyringe";
import {MusicBaseRepository} from "../../../repository/MusicBaseRepository.js";
import {GetMusicHistoryQuery} from "../query/GetMusicHistoryQuery.js";
import {MusicUserRepository} from "../../../repository/MusicUserRepository.js";
@injectable()
export class GetMusicHistoryHandler {
    constructor(@inject(MusicUserRepository) private musicRepo: MusicUserRepository) {}

    async execute(query: GetMusicHistoryQuery) {
        return this.musicRepo.getMusicHistory(query.userId);
    }
}