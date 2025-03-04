import {SongType} from '../enum/SongType.js'
export interface IMusic {
    name: string;
    songType: SongType
    artist: string;
    duration: number;
    genres: string;
    userId?: string;
    officialArtistId?: string;
    playCount?: number;
    loveCount?: number;
    musicPath?: string;
    imgPath?: string;
}   