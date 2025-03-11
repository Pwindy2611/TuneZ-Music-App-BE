import {IMusicBaseRepository} from "../interface/repository/IMusicBaseRepository.js";
import {database} from "../config/firebase/FireBaseConfig.js";
import FetchBase from "../util/base/FetchBase.js";
import {singleton} from "tsyringe";
import UploadBase from "../util/base/UploadBase.js";
import {IMusic} from "../interface/object/IMusic.js";
import {child} from "@firebase/database";

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
            genres: musicData.genres,
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
            genres: musicData.genres,
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
                musicIds.push(child.key);
            }
        });

        const musicDetails = await FetchBase.fetchMusicDetails(musicIds);
        return musicDetails.length > 0 ? musicDetails : null;
    }

    async getMusicByGenres(genre:string): Promise<any> {
        const musicRef = database.ref("musics");
        const snapshot = await musicRef.orderByChild("genres").equalTo(genre).get();

        if (!snapshot.exists()) {
            return null;
        }

        let musicIds: string[] = [];

        snapshot.forEach(child => {
            if(child.val().songType?.toString() === "official"){
                musicIds.push(child.key);
            }
        })

        const musicDetails = await FetchBase.fetchMusicDetails(musicIds);
        return musicDetails.length > 0 ? musicDetails : null;
    }
    async getMusicUrlById(musicId:string): Promise<any> {
        const musicRef = database.ref(`musics/${musicId}`);

        try {
            const snapshot = await musicRef.once("value");
            if (snapshot.exists()) {
                return snapshot.val().musicPath;
            }
            return null;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getMusicDurationById(musicId: string): Promise<number> {
        const musicRef = database.ref(`musics/${musicId}`);

        try {
            const snapshot = await musicRef.once("value");
            if (snapshot.exists()) {
                return snapshot.val().duration;
            }
            return -1;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async isOfficialArtistExist(artistId: string): Promise<boolean> {
        const artistRef = database.ref(`officialArtist/${artistId}`);
        const snapshot = await artistRef.once("value");

        return snapshot.exists();
    }


}