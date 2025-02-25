import {MusicBaseRepository} from "../../repository/MusicBaseRepository.js";
import {inject, injectable} from "tsyringe";
@injectable()
export class CreateMusicHandler {
    constructor(@inject(MusicBaseRepository) private musicRepo: MusicBaseRepository) {}
    async execute(command: any) {
        return this.musicRepo.createMusic(command.musicData);
    }
}