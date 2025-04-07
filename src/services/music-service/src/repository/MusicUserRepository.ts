import {IMusicUserRepository} from "../interface/repository/IMusicUserRepository.js";
import FetchBase from "../util/base/FetchBase.js";
import {auth, database} from "../config/firebase/FireBaseConfig.js";
import {singleton} from "tsyringe";
import UploadBase from "../util/base/UploadBase.js";
import { IMusic } from "../interface/object/IMusic.js";
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
    async uploadMusicByUser(musicData: any): Promise<any> {
        const musicRef = database.ref(`musics`).push();
        const musicId = musicRef.key as string;
        const [musicPath, imgPath] = await Promise.all([
            UploadBase.uploadAndGetUrl(musicData.musicFile, musicId),
            UploadBase.uploadAndGetUrl(musicData.imgFile, musicId)
        ]);

        const newMusicData: IMusic = {
            name: musicData.name,
            songType: musicData.songType,
            artist: musicData.artist,
            duration: musicData.duration,
            genres: musicData.genres,
            userId: musicData.userId,
            musicPath: musicPath ?? '',
            imgPath: imgPath?? ''
        }
        await musicRef.set(newMusicData);
        return musicId;
    }
    async isUserExist(userId: string): Promise<boolean> {
        return !!(await auth.getUser(userId));
    }
}