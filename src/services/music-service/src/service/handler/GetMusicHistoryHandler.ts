import {inject, injectable} from "tsyringe";
import {MusicBaseRepository} from "../../repository/MusicBaseRepository.js";
import {GetMusicHistoryQuery} from "../query/GetMusicHistoryQuery.js";
@injectable()
export class GetMusicHistoryHandler {
    constructor(@inject(MusicBaseRepository) private musicRepo: MusicBaseRepository) {}

    async execute(query: GetMusicHistoryQuery) {
        return this.musicRepo.getMusicHistory(query.userId);
    }
}