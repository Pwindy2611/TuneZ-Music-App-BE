import {inject, injectable} from "tsyringe";
import {MusicBaseRepository} from "../../repository/MusicBaseRepository.js";

@injectable()
export class GetMusicByArtistHandler {
    constructor(@inject(MusicBaseRepository) private musicRepo: MusicBaseRepository) {}

    async execute(command: any){
        return this.musicRepo.getMusicByArtist(command.artist);
    }
}