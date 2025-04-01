import { IsString, IsNumber, IsNotEmpty, validateOrReject } from 'class-validator';
import {IMusic} from "../../interface/object/IMusic.js";
import {SongType} from "../../enum/SongType.js";

export class UploadMusicDto implements IMusic {
    @IsString()
    @IsNotEmpty()
    name: string;

    songType: SongType;

    @IsString()
    @IsNotEmpty()
    artist: string;

    @IsNumber()
    @IsNotEmpty()
    duration: number;

    @IsString()
    @IsNotEmpty()
    genres: string;

    @IsString()
    @IsNotEmpty()
    userId?: string;

    constructor(music: IMusic) {
        this.name = music.name;
        this.artist = music.artist;
        this.duration = music.duration;
        this.genres = music.genres;
        this.songType = music.songType;
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