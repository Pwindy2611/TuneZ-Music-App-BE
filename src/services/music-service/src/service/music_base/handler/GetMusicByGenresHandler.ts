import {inject, injectable} from "tsyringe";
import {MusicBaseRepository} from "../../../repository/MusicBaseRepository.js";
import {GetMusicByGenresQuery} from "../query/GetMusicByGenresQuery.js";

@injectable()
export class GetMusicByGenresHandler {
    constructor(@inject(MusicBaseRepository) private musicRepo: MusicBaseRepository) {}

    async execute(query: GetMusicByGenresQuery) {
        return this.musicRepo.getMusicByGenres(query.genre);
    }
}