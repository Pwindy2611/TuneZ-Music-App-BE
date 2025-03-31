import "reflect-metadata"
import {container} from "tsyringe";
import { CreateMusicService } from "./MusicBaseService.CreateMusic.js";
import { GetAllMusicService} from "./MusicBaseService.GetAllMusic.js";
import { GetMusicByArtistService } from "./MusicBaseService.GetMusicByArtist.js";
import { GetMusicByCategoryService } from "./MusicBaseService.GetMusicByGenres.js";
import {GetMusicById} from "./MusicBaseService.GetMusicById.js";
import { UpdateMusicService } from "./MusicBaseService.UpdateMusic.js";
import { DeleteMusicService } from "./MusicBaseService.DeleteMusic.js";

export const MusicBaseService = {
    createMusic: container.resolve(CreateMusicService),
    getAllMusic: container.resolve(GetAllMusicService),
    getMusicByArtist: container.resolve(GetMusicByArtistService),
    getMusicByCategory: container.resolve(GetMusicByCategoryService),
    getMusicById: container.resolve(GetMusicById),
    updateMusic: container.resolve(UpdateMusicService),
    deleteMusic: container.resolve(DeleteMusicService)
}