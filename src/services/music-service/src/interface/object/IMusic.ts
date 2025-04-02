import { IMusicGenre } from "./IMusicGenre.js";

export interface IMusic {
    name: string;
    songType: string;
    artist: string;
    duration: number;
    genres: string[] | IMusicGenre[];
    officialArtistId?: string;
    userId?: string;
    musicPath?: string;
    imgPath?: string;
    lyrics?: string;
}