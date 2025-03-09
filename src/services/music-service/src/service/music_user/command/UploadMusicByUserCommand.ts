import {injectable} from "tsyringe";

@injectable()
export class UploadMusicByUserCommand {
    constructor(public musicData: any = {}) {}
}