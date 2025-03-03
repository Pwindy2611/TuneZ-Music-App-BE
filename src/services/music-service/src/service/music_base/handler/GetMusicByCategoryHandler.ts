import {inject, injectable} from "tsyringe";
import {MusicBaseRepository} from "../../../repository/MusicBaseRepository.js";
import {GetMusicByCategoryQuery} from "../query/GetMusicByCategoryQuery.js";

@injectable()
export class GetMusicByCategoryHandler {
    constructor(@inject(MusicBaseRepository) private musicRepo: MusicBaseRepository) {}

    async execute(query: GetMusicByCategoryQuery) {
        return this.musicRepo.getMusicByCategory(query.category);
    }
}