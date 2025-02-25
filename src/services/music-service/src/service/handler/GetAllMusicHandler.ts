import {inject, injectable} from "tsyringe";
import {MusicBaseRepository} from "../../repository/MusicBaseRepository.js";

@injectable()
export class GetAllMusicHandler {
    constructor(@inject(MusicBaseRepository) private musicRepo: MusicBaseRepository) {}
    async execute() {
        return this.musicRepo.getAllMusic();
    }
}