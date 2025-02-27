import {IMusicBaseService} from "../../interface/IMusicBaseService.js";
import {generateId} from "../../util/helpers/AuthenticationHelper.js";
import {singleton} from "tsyringe";
import {mediator, repository} from "../../config/container/Container.js";
import {UploadMusicByUserCommand} from "../command/UploadMusicByUserCommand.js";
@singleton()
export class UploadMusicByUserService {
    execute: IMusicBaseService["uploadMusicByUser"] = async (music, musicFile, imgFile) => {
        const musicId = generateId();
        const loveCount = 0;
        const playCount = 0;

        if(!await repository.isUserExist(<string>music.userId)) {
            return Promise.reject(new Error(("Error upload new music: User is not exist")));
        }

        const musicData = {
            musicId,
            ...music,
            loveCount,
            playCount,
            musicFile,
            imgFile
        }

        return await mediator.send(new UploadMusicByUserCommand(musicData))
    }
}