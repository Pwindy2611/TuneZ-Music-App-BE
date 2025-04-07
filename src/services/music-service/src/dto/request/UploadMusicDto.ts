import {IsString, IsNumber, IsNotEmpty, validateOrReject, IsArray} from 'class-validator';
import {IMusic} from "../../interface/object/IMusic.js";
import {IMusicGenre} from "../../interface/object/IMusicGenre.js";

export class UploadMusicDto implements IMusic {
    @IsString()
    @IsNotEmpty()
    name: string;

    songType: string;

    @IsString()
    @IsNotEmpty()
    artist: string;

    @IsNumber()
    @IsNotEmpty()
    duration: number;

    @IsArray()
    @IsNotEmpty()
    genres: string[] | IMusicGenre[];

    @IsString()
    @IsNotEmpty()
    userId?: string;

    @IsString()
    lyrics: string

    constructor(music: IMusic) {
        this.name = music.name;
        this.artist = music.artist;
        this.duration = music.duration;
        this.genres = music.genres;
        this.songType = music.songType;
        this.userId = music.userId;
        this.lyrics = music.lyrics || '';
    }

    async validate() {
        try {
            await validateOrReject(this);
        } catch (errors) {
            throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
        }
    }
}