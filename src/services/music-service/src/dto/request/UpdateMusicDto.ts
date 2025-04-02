import {IsString, IsNumber, IsOptional, IsNotEmpty, validateOrReject, IsArray} from 'class-validator';
import {IMusic} from "../../interface/object/IMusic.js";
import {SongType} from "../../enum/SongType.js";
import {IMusicGenre} from "../../interface/object/IMusicGenre.js";

export class UpdateMusicDto implements Partial<IMusic> {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    artist?: string;

    @IsOptional()
    @IsNumber()
    duration?: number;

    @IsOptional()
    @IsArray()
    @IsNotEmpty()
    genres?: string[] | IMusicGenre[];

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    officialArtistId?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    userId?: string;

    @IsOptional()
    @IsString()
    lyrics?: string;

    constructor(music: Partial<IMusic>) {
        if (music.name) this.name = music.name;
        if (music.artist) this.artist = music.artist;
        if (music.duration) this.duration = music.duration;
        if (music.genres) this.genres = music.genres;
        if (music.officialArtistId) this.officialArtistId = music.officialArtistId;
        if (music.userId) this.userId = music.userId;
        if (music.lyrics) this.lyrics = music.lyrics;
    }

    async validate() {
        try {
            await validateOrReject(this);
        } catch (errors) {
            throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
        }
    }
} 