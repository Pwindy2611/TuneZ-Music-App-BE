import {IMusicBaseService} from "../../interface/IMusicBaseService.js";
import {Lifecycle, scoped} from "tsyringe";
import {musicBaseMediator, musicBaseRepository} from "../../config/container/Container.js";
import {UploadMusicByUserCommand} from "./command/UploadMusicByUserCommand.js";
@scoped(Lifecycle.ResolutionScoped)
export class UploadMusicByUserService {
    execute: IMusicBaseService["uploadMusicByUser"] = async (music, musicFile, imgFile) => {
        const loveCount = 0;
        const playCount = 0;

        if(!await musicBaseRepository.isUserExist(<string>music.userId)) {
            return Promise.reject(new Error(("Error upload new music: User is not exist")));
        }

        const musicData = {
            ...music,
            loveCount,
            playCount,
            musicFile,
            imgFile
        }

        return await musicBaseMediator.send(new UploadMusicByUserCommand(musicData))
    }
}