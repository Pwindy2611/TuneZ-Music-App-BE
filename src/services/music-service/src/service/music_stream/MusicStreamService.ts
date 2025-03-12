import {GetStreamMusicService} from "./MusicStreamService.GetStreamMusic.js";
import {GetUserMusicStateService} from "./MusicStreamService.GetUserMusicState.js";
import {UpdateUserMusicStateService} from "./MusicStreamService.UpdateUserMusicState.js";
import {container} from "tsyringe";

export const MusicStreamService = {
    getStreamMusic: container.resolve(GetStreamMusicService),
    getUserMusicState: container.resolve(GetUserMusicStateService),
    updateUserMusicState: container.resolve(UpdateUserMusicStateService),
}