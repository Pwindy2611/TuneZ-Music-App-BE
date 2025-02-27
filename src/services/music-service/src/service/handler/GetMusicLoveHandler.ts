import {inject, injectable} from "tsyringe";
import {MusicBaseRepository} from "../../repository/MusicBaseRepository.js";
import {GetMusicLoveQuery} from "../query/GetMusicLoveQuery.js";
@injectable()
export class GetMusicLoveHandler {
    constructor(@inject(MusicBaseRepository) private musicRepo: MusicBaseRepository) {}

    async execute(query: GetMusicLoveQuery): Promise<any> {
        return await this.musicRepo.getMusicLove(query.userId);
    }
}