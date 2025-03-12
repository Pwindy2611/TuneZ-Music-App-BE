import {GetStreamMusicQuery} from "../query/GetStreamMusicQuery.js";
import {inject, injectable} from "tsyringe";
import {MusicStreamRepository} from "../../../repository/MusicStreamRepository.js";
@injectable()
export class GetStreamMusicHandler {
    constructor(@inject(MusicStreamRepository) private readonly musicStreamRepository: MusicStreamRepository) {}
    execute(query: GetStreamMusicQuery) {
        return this.musicStreamRepository.getStreamMusic(query.userId, query.musicId);
    }
}