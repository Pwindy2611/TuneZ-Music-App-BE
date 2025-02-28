import "reflect-metadata"
import {container} from "tsyringe";
import { CreateMusicService } from "./MusicBaseService.CreateMusic.js";
import { GetAllMusicService} from "./MusicBaseService.GetAllMusic.js";
import { GetMusicByArtistService } from "./MusicBaseService.GetMusicByArtist.js";
import { GetMusicByCategoryService } from "./MusicBaseService.GetMusicByCategory.js";
import { GetMusicHistoryService } from "./MusicBaseService.GetMusicHistory.js";
import { UploadMusicByUserService } from "./MusicBaseService.UploadMusicByUser.js";
import {GetMusicLoveService} from "./MusicBaseService.GetMusicLove.js";

export const MusicBaseService = {
    createMusic: container.resolve(CreateMusicService),
    getAllMusic: container.resolve(GetAllMusicService),
    getMusicByArtist: container.resolve(GetMusicByArtistService),
    getMusicByCategory: container.resolve(GetMusicByCategoryService),
    getMusicHistory: container.resolve(GetMusicHistoryService),
    getMusicLove: container.resolve(GetMusicLoveService),
    uploadMusicByUser: container.resolve(UploadMusicByUserService),
    
}