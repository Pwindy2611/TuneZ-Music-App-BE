import {IMusicBaseService} from "../../interface/service/IMusicBaseService.js";
import {musicBaseRepository} from "../../config/container/Container.js";
import {singleton} from "tsyringe";

@singleton()
export class GetMusicByArtistService{
    execute: IMusicBaseService["getMusicByArtist"] = async (artist) => {
        return await musicBaseRepository.getMusicByArtist(artist);
    };
}
