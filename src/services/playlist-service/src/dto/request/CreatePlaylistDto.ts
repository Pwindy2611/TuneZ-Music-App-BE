import {IsString, validateOrReject} from "class-validator";
import {IPlaylist} from "../../interface/object/IPlaylist.js";

export class CreatePlaylistDto implements IPlaylist{
    @IsString()
    title: string;

    @IsString()
    type: string;

    @IsString()
    value:string

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