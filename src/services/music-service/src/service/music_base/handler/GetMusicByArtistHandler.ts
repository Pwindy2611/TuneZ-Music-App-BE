import {inject, injectable} from "tsyringe";
import {MusicBaseRepository} from "../../../repository/MusicBaseRepository.js";
import {GetMusicByArtistQuery} from "../query/GetMusicByArtistQuery.js";

@injectable()
export class GetMusicByArtistHandler {
    constructor(@inject(MusicBaseRepository) private musicRepo: MusicBaseRepository) {}

    async execute(query: GetMusicByArtistQuery){
        return this.musicRepo.getMusicByArtist(query.artist);
    }
}