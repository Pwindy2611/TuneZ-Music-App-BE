import { IsString, IsNumber, validateOrReject } from 'class-validator';
import {IMusic} from "../interface/IMusic.js";
import {SongType} from "../enum/SongType.js";

export class CreateMusicDto implements IMusic {
    @IsString()
    name: string;
    
    songType: SongType;
    
    @IsString()
    artist: string;

    @IsNumber()
    duration: number;

    @IsString()
    category: string;

    @IsString()
    officialArtistId?: string;

    constructor(music: IMusic) {
        this.name = music.name;
        this.artist = music.artist;
        this.duration = music.duration;
        this.category = music.category;
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