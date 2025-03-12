import {UpdateUserMusicStateCommand} from "../command/UpdateUserMusicStateCommand.js";
import {inject, injectable} from "tsyringe";
import {MusicStreamRepository} from "../../../repository/MusicStreamRepository.js";
@injectable()
export class UpdateUserMusicStateHandler {
    constructor(@inject(MusicStreamRepository) private readonly musicStreamRepository: MusicStreamRepository) {}
    execute(command: UpdateUserMusicStateCommand) {
        return this.musicStreamRepository.updateUserMusicState(command.userId, command.state)
    }
}