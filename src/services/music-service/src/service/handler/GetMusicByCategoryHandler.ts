import {inject, injectable} from "tsyringe";
import {MusicBaseRepository} from "../../repository/MusicBaseRepository.js";

@injectable()
export class GetMusicByCategoryHandler {
    constructor(@inject(MusicBaseRepository) private musicRepo: MusicBaseRepository) {}

    async execute(command: any) {
        return this.musicRepo.getMusicByCategory(command.category);
    }
}