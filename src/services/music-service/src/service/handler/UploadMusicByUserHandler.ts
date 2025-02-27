import {inject, injectable} from "tsyringe";
import {MusicBaseRepository} from "../../repository/MusicBaseRepository.js";
import {UploadMusicByUserCommand} from "../command/UploadMusicByUserCommand.js";
@injectable()
export class UploadMusicByUserHandler {
    constructor(@inject(MusicBaseRepository) private musicRepo: MusicBaseRepository) {}
    async execute(command: UploadMusicByUserCommand){
        return await this.musicRepo.uploadMusic(command.musicData);
    }
}