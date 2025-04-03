import "reflect-metadata"
import {container} from "tsyringe";
import { CreateMusicService } from "./MusicBaseService.CreateMusic.js";
import { GetAllMusicService} from "./MusicBaseService.GetAllMusic.js";
import { GetMusicByArtistService } from "./MusicBaseService.GetMusicByArtist.js";
import { GetMusicByCategoryService } from "./MusicBaseService.GetMusicByGenres.js";
import {GetMusicById} from "./MusicBaseService.GetMusicById.js";
import { UpdateMusicService } from "./MusicBaseService.UpdateMusic.js";
import { DeleteMusicService } from "./MusicBaseService.DeleteMusic.js";
import { CreateGenreService } from "./MusicBaseService.CreateGenre.js";
import { GetAllGenresService } from "./MusicBaseService.GetAllGenres.js";
import { GetGenreByIdService } from "./MusicBaseService.GetGenreById.js";
import { UpdateGenreService } from "./MusicBaseService.UpdateGenre.js";
import { DeleteGenreService } from "./MusicBaseService.DeleteGenre.js";
import { IsGenreExistService } from "./MusicBaseService.IsGenreExist.js";

export const MusicBaseService = {
    createMusic: container.resolve(CreateMusicService),
    getAllMusic: container.resolve(GetAllMusicService),
    getMusicByArtist: container.resolve(GetMusicByArtistService),
    getMusicByCategory: container.resolve(GetMusicByCategoryService),
    getMusicById: container.resolve(GetMusicById),
    updateMusic: container.resolve(UpdateMusicService),
    deleteMusic: container.resolve(DeleteMusicService),
    
    // Genres services
    createGenre: container.resolve(CreateGenreService),
    getAllGenres: container.resolve(GetAllGenresService),
    getGenreById: container.resolve(GetGenreByIdService),
    updateGenre: container.resolve(UpdateGenreService),
    deleteGenre: container.resolve(DeleteGenreService),
    isGenreExist: container.resolve(IsGenreExistService)
}