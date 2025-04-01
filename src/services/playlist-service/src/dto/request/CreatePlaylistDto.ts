import {IsString, IsNotEmpty, MinLength, MaxLength, IsEnum, validateOrReject} from "class-validator";
import {IPlaylist} from "../../interface/object/IPlaylist.js";
import {PlaylistType} from "../../enum/PlaylistType.js";

export class CreatePlaylistDto implements IPlaylist{
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(100)
    title: string;

    @IsString()
    @IsNotEmpty()
    @IsEnum(PlaylistType)
    type: string;

    @IsString()
    @IsNotEmpty()
    value: string;

    constructor(playlist: IPlaylist) {
        this.title = playlist.title;
        this.type = playlist.type;
        this.value = playlist.value;
    }

    async validate() {
        try {
            await validateOrReject(this);
        }catch (error) {
            throw new Error(error.message);
        }
    }
}