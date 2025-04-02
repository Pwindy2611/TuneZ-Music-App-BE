import { IMusicGenre } from "../../interface/object/IMusicGenre.js";

export class MusicResponseDto {
    _id: string;
    name: string;
    artist: string;
    genres: IMusicGenre[];
    duration: number;
    imgPath: string;
    lyrics: string;
    
    constructor(_id: string,
                name: string,
                artist: string,
                genres: IMusicGenre[],
                duration: number, 
                imgPath: string,
                lyrics: string) {
        this._id = _id;
        this.artist = artist;
        this.name = name;
        this.genres = genres;
        this.duration = duration;
        this.imgPath = imgPath;
        this.lyrics = lyrics;
    }
}