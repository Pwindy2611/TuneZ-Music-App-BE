import { IsString, IsNumber, validateOrReject } from 'class-validator';
import {IMusic} from "../../interface/object/IMusic.js";
import {SongType} from "../../enum/SongType.js";

export class CreateMusicDto implements IMusic {
    @IsString()
    name: string;
    
    songType: SongType;
    
    @IsString()
    artist: string;

    @IsNumber()
    duration: number;

    @IsString()
    genres: string;

    @IsString()
    officialArtistId?: string;

    @IsString()
    userId?: string;

    constructor(music: IMusic) {
        this.name = music.name;
        this.artist = music.artist;
        this.duration = music.duration;
        this.genres = music.genres;
        this.songType = music.songType;
        this.officialArtistId = music.officialArtistId;
        this.userId = music.userId;
    }

    async validate() {
        try {
            await validateOrReject(this);
        } catch (errors) {
            throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
        }
    }
}