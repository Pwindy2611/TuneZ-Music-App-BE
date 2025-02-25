import {injectable} from "tsyringe";

@injectable()
export class CreateMusicCommand {
    private musicData: any;
    constructor(musicData: any) {
        this.musicData = musicData;
    }
}