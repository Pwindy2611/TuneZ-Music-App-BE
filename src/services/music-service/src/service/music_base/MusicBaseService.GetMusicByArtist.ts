import {IMusicBaseService} from "../../interface/IMusicBaseService.js";
import {mediator} from "../mediator/Container.js";
import {GetMusicByArtistQuery} from "../query/GetMusicByArtistQuery.js";
import {singleton} from "tsyringe";
@singleton()
export class GetMusicByArtistService{
    execute: IMusicBaseService["getMusicByArtist"] = async (artist) => {
        try{
            return await mediator.send(new GetMusicByArtistQuery(artist));
        }catch (error) {
            throw new Error("Error retrieving music by artist: " + error.message);
        }
    };
}
