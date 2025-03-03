import {IsString, validateOrReject} from "class-validator";

export class CreatePlaylistDto {
    @IsString()
    title: string;

    @IsString()
    type: string;

    @IsString()
    value:string

    constructor(title: string, type: string, value: string) {
        this.title = title;
        this.type = type;
        this.value = value;
    }

    async validate() {
        try {
            await validateOrReject(this);
        }catch (error) {
            throw new Error(error.message);
        }
    }
}