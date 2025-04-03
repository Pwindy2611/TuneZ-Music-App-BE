import {IMusic} from "../object/IMusic.js";
import {IMusicFile} from "../object/IMusicFile.js";
import {MusicResponseDto} from "../../dto/response/MusicResponseDto.js";

export interface IMusicBaseService {
    createMusic(music: IMusic, musicFile: IMusicFile, imgFile: IMusicFile): Promise<string | null>;
    updateMusic(id: string, music: IMusic, musicFile?: IMusicFile, imgFile?: IMusicFile): Promise<string | null>;
    deleteMusic(id: string): Promise<string | null>;
    getAllMusic(): Promise<MusicResponseDto[] | null>;
    getMusicByArtist(artist: string): Promise<MusicResponseDto[] | null>;
    getMusicByGenres(genre: string): Promise<MusicResponseDto[] | null>;
    getMusicById(musicId: string): Promise<IMusic | null>;

    // Genres methods
    createGenre(name: string, description?: string): Promise<string | null>;
    getAllGenres(): Promise<any[] | null>;
    getGenreById(genreId: string): Promise<any | null>;
    updateGenre(genreId: string, updateData: any): Promise<string | null>;
    deleteGenre(genreId: string): Promise<string | null>;
    isGenreExist(genreId: string): Promise<boolean>;
}