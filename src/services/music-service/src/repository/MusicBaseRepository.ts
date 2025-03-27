import {IMusicBaseRepository} from "../interface/repository/IMusicBaseRepository.js";
import {database, firestore} from "../config/firebase/FireBaseConfig.js";
import FetchBase from "../util/base/FetchBase.js";
import {singleton} from "tsyringe";
import UploadBase from "../util/base/UploadBase.js";
import {IMusic} from "../interface/object/IMusic.js";

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
            musicPath: musicPath ?? '',
            imgPath: imgPath?? ''
        }
        await musicRef.set(newMusicData);
        return musicId;
    }
        

    async getAllMusic(): Promise<any> {
        const musicRef = database.ref("musics");
        const snapshot = await musicRef.get();
        if (!snapshot.exists()) return null;

        const musicIds = Object.keys(snapshot.val());
        const musicDetails = await FetchBase.fetchMusicDetails(musicIds);
        return musicDetails.length ? musicDetails : null;
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

    async getMusicById(musicId: string): Promise<any> {
        const musicRef = database.ref(`musics/${musicId}`);
        const snapshot = await musicRef.get();
        if (!snapshot.exists()) return null;

        return snapshot.val();
    }

    async isOfficialArtistExist(artistId: string): Promise<boolean> {
        const artistRef = database.ref(`officialArtists/${artistId}`);
        const snapshot = await artistRef.once("value");

        return snapshot.exists();
    }

    async incrementLoveCount(musicId: string): Promise<void> {
        const musicRef = firestore.collection('musics').doc(musicId);
        await firestore.runTransaction(async (transaction) => {
            const musicDoc = await transaction.get(musicRef);
            if (!musicDoc.exists) {
                transaction.set(musicRef, { loveCount: 1 });
            } else {
                const currentPlayCount = musicDoc.data()?.loveCount || 0;
                transaction.update(musicRef, { loveCount: currentPlayCount + 1 });
            }
        });
    }

}