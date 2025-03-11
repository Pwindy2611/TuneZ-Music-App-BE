import {inject, injectable} from "tsyringe";
import {MusicBaseRepository} from "../../../repository/MusicBaseRepository.js";
import {GetMusicDurationByIdQuery} from "../query/GetMusicDurationByIdQuery.js";
@injectable()
export class GetMusicDurationByIdHandler {
    constructor(@inject(MusicBaseRepository) private musicRepo: MusicBaseRepository) {}

    execute(query: GetMusicDurationByIdQuery){
        return this.musicRepo.getMusicDurationById(query.musicId);
    }
}