import {ILove} from "./ILove";

export interface ILoveBaseService {
    saveLoveMusic(love: ILove): Promise<string | undefined>
}