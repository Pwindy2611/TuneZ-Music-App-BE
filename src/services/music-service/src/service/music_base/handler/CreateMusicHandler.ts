import {MusicBaseRepository} from "../../../repository/MusicBaseRepository.js";
import {inject, injectable} from "tsyringe";
import {CreateMusicCommand} from "../command/CreateMusicCommand.js";
@injectable()
export class CreateMusicHandler {
    constructor(@inject(MusicBaseRepository) private musicRepo: MusicBaseRepository) {}
    async execute(command: CreateMusicCommand) {
        return this.musicRepo.createMusic(command.musicData);
    }
}