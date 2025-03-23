import {inject, injectable} from "tsyringe";
import {MusicBaseRepository} from "../../../repository/MusicBaseRepository.js";
import {GetMusicByGenresQuery} from "../query/GetMusicByGenresQuery.js";
import {GetMusicByIdQuery} from "../query/GetMusicByIdQuery.js";

@injectable()
export class GetMusicByIdHandler {
    constructor(@inject(MusicBaseRepository) private musicRepo: MusicBaseRepository) {}

    async execute(query: GetMusicByIdQuery) {
        return this.musicRepo.getMusicById(query.id);
    }
}