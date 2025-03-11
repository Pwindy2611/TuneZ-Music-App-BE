import {inject, injectable} from "tsyringe";
import {MusicBaseRepository} from "../../../repository/MusicBaseRepository.js";
import {GetMusicUrlByIdQuery} from "../query/GetMusicUrlByIdQuery.js";

@injectable()
export class GetMusicUrlByIdHandler{
    constructor(@inject(MusicBaseRepository) private musicRepo: MusicBaseRepository) {}
    async execute(query: GetMusicUrlByIdQuery) {
        return this.musicRepo.getMusicUrlById(query.id);
    }
}