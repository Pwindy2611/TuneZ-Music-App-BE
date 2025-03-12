import {GetUserMusicStateQuery} from "../query/GetUserMusicStateQuery.js";
import {inject, injectable} from "tsyringe";
import {MusicStreamRepository} from "../../../repository/MusicStreamRepository.js";
@injectable()
export class GetUserMusicStateHandler {
    constructor(@inject(MusicStreamRepository) private readonly musicStreamRepository: MusicStreamRepository) {}
    execute(query: GetUserMusicStateQuery) {
        return this.musicStreamRepository.getUserMusicState(query.userId)
    }
}