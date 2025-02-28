import {IMusicRecService} from "../../interface/IMusicRecService.js";
import {auth, firestore} from "../../config/firebase/FireBaseConfig.js";
import {GetMusicResponseDto} from "../../dto/GetMusicResponseDto.js";
import {MusicBaseService} from "../music_base/MusicBaseService.js";
import {musicRecMediator} from "../../config/container/Container.js";
import {GenerateFollowedArtistsPlaylistQuery} from "./query/GenerateFollowedArtistsPlaylistQuery.js";
import {singleton} from "tsyringe";

@singleton()
export class GenerateFollowedArtistsPlaylistService{
    execute: IMusicRecService["generateFollowedArtistsPlaylist"] = async (userId, playlistLimit ) => {
        return await musicRecMediator.send(new GenerateFollowedArtistsPlaylistQuery(userId, playlistLimit)  );
    }
}