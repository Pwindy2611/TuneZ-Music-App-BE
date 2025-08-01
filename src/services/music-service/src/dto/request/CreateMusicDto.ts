import {IsString, IsNumber, IsNotEmpty, validateOrReject, IsArray} from 'class-validator';
import {IMusic} from "../../interface/object/IMusic.js";
import {SongType} from "../../enum/SongType.js";
import {IMusicGenre} from "../../interface/object/IMusicGenre.js";

export class CreateMusicDto implements IMusic {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
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
    officialArtistId?: string;

    constructor(music: IMusic) {
        this.name = music.name;
        this.artist = music.artist;
        this.duration = music.duration;
        this.genres = music.genres;
        this.songType = music.songType;
        this.officialArtistId = music.officialArtistId;
    }

    async validate() {
        try {
            await validateOrReject(this);
        } catch (errors) {
            throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
        }
    }
}