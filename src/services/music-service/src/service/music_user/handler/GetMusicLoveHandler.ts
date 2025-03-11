import {inject, injectable} from "tsyringe";
import {GetMusicLoveQuery} from "../query/GetMusicLoveQuery.js";
import {MusicUserRepository} from "../../../repository/MusicUserRepository.js";
@injectable()
export class GetMusicLoveHandler {
    constructor(@inject(MusicUserRepository) private musicRepo: MusicUserRepository) {}

    async execute(query: GetMusicLoveQuery): Promise<any> {
        return await this.musicRepo.getMusicLove(query.userId);
    }
}