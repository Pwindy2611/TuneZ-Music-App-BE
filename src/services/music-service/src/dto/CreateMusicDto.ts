import { IsString, IsNumber, validateOrReject } from 'class-validator';
import { Type } from "class-transformer";
import {IMusic} from "../interface/IMusic.js";

export class CreateMusicDto implements IMusic {
    @IsString()
    name: string;

    @IsString()
    artist: string;

    @IsNumber()
    duration: number;

    @IsString()
    category: string;

    @IsString()
    userId: string;

    constructor(music: IMusic) {
        this.name = music.name;
        this.artist = music.artist;
        this.duration = music.duration;
        this.category = music.category;
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