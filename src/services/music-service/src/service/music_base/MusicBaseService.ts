import "reflect-metadata"
import { CreateMusicService } from "./MusicBaseService.CreateMusic.js";
import { GetAllMusicService} from "./MusicBaseService.GetAllMusic.js";
import { GetMusicByArtistService } from "./MusicBaseService.GetMusicByArtist.js";
import { GetMusicByCategoryService } from "./MusicBaseService.GetMusicByCategory.js";
import { getMusicHistory } from "./MusicBaseService.GetMusicHistory.js";
import { uploadMusicByUser } from "../music_rec/MusicBaseService.UploadMusicByUser.js";
import {container} from "tsyringe";

export const MusicBaseService = {
    createMusic: container.resolve(CreateMusicService),
    getAllMusic: container.resolve(GetAllMusicService),
    getMusicByArtist: container.resolve(GetMusicByArtistService),
    getMusicByCategory: container.resolve(GetMusicByCategoryService),
    getMusicHistory,
    uploadMusicByUser,
    
}