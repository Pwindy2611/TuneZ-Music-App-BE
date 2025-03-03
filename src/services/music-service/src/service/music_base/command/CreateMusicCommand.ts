import {injectable} from "tsyringe";

@injectable()
export class CreateMusicCommand {
    constructor(public musicData: any  = {}) {}
}