import {IMusicBaseRepository} from "../interface/IMusicBaseRepository.js";
import {auth, database} from "../config/firebase/FireBaseConfig.js";
import FetchBase from "../util/base/FetchBase.js";
import {singleton} from "tsyringe";
import UploadBase from "../util/base/UploadBase.js";
import {IMusic} from "../interface/IMusic.js";

@singleton()
export class MusicBaseRepository implements IMusicBaseRepository {
    async createMusic(musicData: any): Promise<string> {
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
            category: musicData.category,
            officialArtistId: musicData.officialArtistId,
            playCount: musicData.playCount?? 0,
            loveCount: musicData.loveCount?? 0,
            musicPath: musicPath ?? '',
            imgPath: imgPath?? ''
        }
        await musicRef.set(newMusicData);
        return musicId;
    }
    async uploadMusic(musicData: any): Promise<string> {
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
            category: musicData.category,
            userId: musicData.userId,
            playCount: musicData.playCount?? 0,
            loveCount: musicData.loveCount?? 0,
            musicPath: musicPath ?? '',
            imgPath: imgPath?? ''
        }
        await musicRef.set(newMusicData);
        return musicId;
    }

    async getAllMusic(): Promise<any> {
        const musicRef = database.ref("musics");
        const snapshot = await musicRef.get();
        return snapshot.exists() ? snapshot.val() : null;
    }

    async getMusicByArtist(artist: string): Promise<any> {
        const musicRef = database.ref("musics");

        const snapshot = await musicRef.orderByChild("artist").equalTo(artist).get();

        if (!snapshot.exists()) {
            return null
        }

        let musicIds: string[] = [];

        snapshot.forEach(child => {
            if (child.val().songType?.toString() === "official") {
                musicIds.push(child.val().musicId?.toString());
            }
        });

        const musicDetails = await FetchBase.fetchMusicDetails(musicIds);
        return musicDetails.length > 0 ? musicDetails : null;
    }

    async getMusicByCategory(category: string): Promise<any> {
        const musicRef = database.ref("musics");
        const snapshot = await musicRef.orderByChild("category").equalTo(category).get();

        if (!snapshot.exists()) {
            return snapshot.val();
        }

        let musicIds: string[] = [];

        snapshot.forEach(child => {
            if(child.val().songType?.toString() === "official"){
                musicIds.push(child.val().musicId?.toString());
            }
        })

        const musicDetails = await FetchBase.fetchMusicDetails(musicIds);
        return musicDetails.length > 0 ? musicDetails : null;
    }

    async getMusicHistory(userId: string): Promise<any> {
        const musicIds = await FetchBase.fetchMusicIdsFromHistory(userId, 50);
        const uniqueMusicIds = [...new Set(musicIds)];

        return await FetchBase.fetchMusicDetails(uniqueMusicIds);
    }

    async getMusicLove(userId: string): Promise<any> {
        const musicIds = await FetchBase.fetchMusicIdsFromLove(userId, 50);
        const uniqueMusicIds = [...new Set(musicIds)];

        return await FetchBase.fetchMusicDetails(uniqueMusicIds);
    }

    async isOfficialArtistExist(artistId: string): Promise<boolean> {
        const artistRef = database.ref(`officialArtist/${artistId}`);
        const snapshot = await artistRef.once("value");

        return snapshot.exists();
    }
    async isUserExist(userId: string): Promise<boolean> {
        return !!(await auth.getUser(userId));
    }

}