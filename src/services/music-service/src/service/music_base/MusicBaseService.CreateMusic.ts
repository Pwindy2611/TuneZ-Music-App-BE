import {IMusicBaseService} from "../../interface/IMusicBaseService.js";
import {generateId} from "../../util/helpers/AuthenticationHelper.js";
import {mediator, repository} from "../mediator/Container.js";
import {CreateMusicCommand} from "../command/CreateMusicCommand.js";
import {singleton} from "tsyringe";
@singleton()
export class CreateMusicService{

    execute: IMusicBaseService["createMusic"] = async (music, musicFile, imgFile) => {
        const musicId = generateId();
        const loveCount = 0;
        const playCount = 0;

        if(!await repository.isOfficialArtistExist(<string>music.officialArtistId)) {
            return Promise.reject(new Error(("Error creating new music: Official Artist is not exist")));
        }

        const musicData = {
            musicId,
            ...music,
            loveCount,
            playCount,
            musicFile,
            imgFile
        }
        return await mediator.send(new CreateMusicCommand(musicData));
    };
}



