import {IMusicBaseService} from "../../interface/service/IMusicBaseService.js";
import {musicBaseMediator, musicBaseRepository} from "../../config/container/Container.js";
import {CreateMusicCommand} from "./command/CreateMusicCommand.js";
import {Lifecycle, scoped} from "tsyringe";
@scoped(Lifecycle.ResolutionScoped)
export class CreateMusicService{

    execute: IMusicBaseService["createMusic"] = async (music, musicFile, imgFile) => {
        const loveCount = 0;
        const playCount = 0;

        if(!await musicBaseRepository.isOfficialArtistExist(<string>music.officialArtistId)) {
            return Promise.reject(new Error(("Error creating new music: Official Artist is not exist")));
        }

        const musicData = {
            ...music,
            loveCount,
            playCount,
            musicFile,
            imgFile
        }
        return await musicBaseMediator.send(new CreateMusicCommand(musicData));
    };
}



