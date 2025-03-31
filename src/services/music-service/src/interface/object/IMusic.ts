import {SongType} from '../../enum/SongType.js'
export interface IMusic {
    name: string;
    songType: SongType
    artist: string;
    duration: number;
    genres: string;
    userId?: string;
    officialArtistId?: string;
    musicPath?: string;
    imgPath?: string;
    lyrics?: string;
}