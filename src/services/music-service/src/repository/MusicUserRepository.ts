import {IMusicUserRepository} from "../interface/repository/IMusicUserRepository.js";
import FetchBase from "../util/base/FetchBase.js";
import {auth} from "../config/firebase/FireBaseConfig.js";
import {singleton} from "tsyringe";
@singleton()
export class MusicUserRepository implements IMusicUserRepository {
    async getMusicHistory(userId: string): Promise<any> {
        const musicIds = await FetchBase.fetchMusicIdsFromHistory(userId, 50);
        const uniqueMusicIds = [...new Set<string>(musicIds as string[])];

        return await FetchBase.fetchMusicDetails(uniqueMusicIds);
    }
    async getMusicLove(userId: string): Promise<any> {
        const musicIds = await FetchBase.fetchMusicIdsFromLove(userId, 50);
        const uniqueMusicIds = [...new Set<string>(musicIds as string[])];

        return await FetchBase.fetchMusicDetails(uniqueMusicIds);
    }
    async isUserExist(userId: string): Promise<boolean> {
        return !!(await auth.getUser(userId));
    }
}