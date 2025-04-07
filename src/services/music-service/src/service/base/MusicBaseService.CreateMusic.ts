import {IMusicBaseService} from "../../interface/service/IMusicBaseService.js";
import {musicBaseRepository} from "../../config/container/Container.js";
import { Lifecycle, scoped } from "tsyringe";
import { IMusicGenre } from "../../interface/object/IMusicGenre.js";
import { IMusic } from "../../interface/object/IMusic.js";

@scoped(Lifecycle.ResolutionScoped)
export class CreateMusicService{
    execute: IMusicBaseService["createMusic"] = async (music, musicFile, imgFile) => {
        if (!music.genres || !Array.isArray(music.genres) || music.genres.length === 0) {
            return Promise.reject(new Error("Music must have at least one genre"));
        }

        if(!await musicBaseRepository.isOfficialArtistExist(<string>music.officialArtistId)) {
            return Promise.reject(new Error("Error creating new music: Official Artist is not exist"));
        }

        // Genres đã là IMusicGenre[] nên không cần validate và fetch thêm
        const musicData: IMusic = {
            ...music,
            genres: music.genres
        };

        return await musicBaseRepository.createMusic({
            ...musicData,
            musicFile,
            imgFile
        });
    };
}



