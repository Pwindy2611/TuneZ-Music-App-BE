import {ILove} from "./ILove";

export interface ILoveBaseService {
    saveLoveMusic(love: ILove): Promise<string | undefined>
    removeLoveMusic(userId: string, musicId: string): Promise<void>
}