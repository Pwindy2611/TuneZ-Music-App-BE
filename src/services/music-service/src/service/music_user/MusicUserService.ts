import {container} from "tsyringe";
import {GetMusicHistoryService} from "./MusicUserService.GetMusicHistory.js";
import {GetMusicLoveService} from "./MusicUserService.GetMusicLove.js";
import {UploadMusicByUserService} from "./MusicUserService.UploadMusicByUser.js";

export const MusicUserService = {
    uploadMusicByUser: container.resolve(UploadMusicByUserService),
    getMusicHistory: container.resolve(GetMusicHistoryService),
    getMusicLove: container.resolve(GetMusicLoveService),
}