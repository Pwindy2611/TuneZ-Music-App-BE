import "reflect-metadata"
import {container} from "tsyringe";
import { CreateMusicService } from "./MusicBaseService.CreateMusic.js";
import { GetAllMusicService} from "./MusicBaseService.GetAllMusic.js";
import { GetMusicByArtistService } from "./MusicBaseService.GetMusicByArtist.js";
import { GetMusicByCategoryService } from "./MusicBaseService.GetMusicByGenres.js";
import {GetMusicUrlByIdService} from "./MusicBaseService.GetMusicUrlById.js";
import {GetMusicDurationByIdService} from "./MusicBaseService.GetMusicDurationById.js";

export const MusicBaseService = {
    createMusic: container.resolve(CreateMusicService),
    getAllMusic: container.resolve(GetAllMusicService),
    getMusicByArtist: container.resolve(GetMusicByArtistService),
    getMusicByCategory: container.resolve(GetMusicByCategoryService),
    getMusicUrlById: container.resolve(GetMusicUrlByIdService),
    getMusicDurationById: container.resolve(GetMusicDurationByIdService),
}