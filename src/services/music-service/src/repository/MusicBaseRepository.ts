import {IMusicBaseRepository} from "../interface/repository/IMusicBaseRepository.js";
import {database, firestore} from "../config/firebase/FireBaseConfig.js";
import FetchBase from "../util/base/FetchBase.js";
import {singleton} from "tsyringe";
import UploadBase from "../util/base/UploadBase.js";
import {IMusic} from "../interface/object/IMusic.js";
import {IMusicFile} from "../interface/object/IMusicFile.js";
import {IGenre} from "../interface/object/IGenre.js";

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

    async updateMusic(musicId: string, updateData: any): Promise<any> {
        const musicRef = database.ref(`musics/${musicId}`);
        const snapshot = await musicRef.get();
        
        if (!snapshot.exists()) {
            throw new Error('Music not found');
        }

        await musicRef.update(updateData);
        return await this.getMusicById(musicId);
    }

    async deleteMusic(musicId: string): Promise<void> {
        const musicRef = database.ref(`musics/${musicId}`);
        const snapshot = await musicRef.get();

        if (!snapshot.exists()) {
            throw new Error('Music not found');
        }
        const firestoreRef = firestore.collection('musics').doc(musicId);
        await firestoreRef.delete();

        await UploadBase.deleteFolder(musicId);


        await musicRef.remove();
    }

    async uploadMusicFile(musicId: string, file: IMusicFile): Promise<string> {
        return await UploadBase.uploadAndGetUrl(file, musicId) ?? '';
    }

    async createGenre(name: string, description?: string): Promise<string> {
        const genreRef = database.ref(`genres`).push();
        const genreId = genreRef.key as string;

        const newGenreData: Omit<IGenre, 'id'> = {
            name,
            description: description || '',
            createdAt: new Date().toISOString()
        };

        await genreRef.set(newGenreData);
        return genreId;
    }

    async getAllGenres(): Promise<IGenre[]> {
        const genreRef = database.ref("genres");
        const snapshot = await genreRef.get();
        
        if (!snapshot.exists()) {
            return [];
        }

        const genres: IGenre[] = [];
        snapshot.forEach(child => {
            genres.push({
                id: child.key,
                ...child.val()
            });
        });

        return genres;
    }

    async getGenreById(genreId: string): Promise<IGenre | null> {
        const genreRef = database.ref(`genres/${genreId}`);
        const snapshot = await genreRef.get();
        
        if (!snapshot.exists()) {
            return null;
        }

        return {
            id: snapshot.key,
            ...snapshot.val()
        };
    }

    async updateGenre(genreId: string, updateData: Partial<IGenre>): Promise<IGenre> {
        const genreRef = database.ref(`genres/${genreId}`);
        const snapshot = await genreRef.get();
        
        if (!snapshot.exists()) {
            throw new Error('Genre not found');
        }

        await genreRef.update(updateData);
        return await this.getGenreById(genreId) as IGenre;
    }

    async deleteGenre(genreId: string): Promise<void> {
        const genreRef = database.ref(`genres/${genreId}`);
        const snapshot = await genreRef.get();
        
        if (!snapshot.exists()) {
            throw new Error('Genre not found');
        }

        await genreRef.remove();
    }

    async isGenreExist(genreId: string): Promise<boolean> {
        const genreRef = database.ref(`genres/${genreId}`);
        const snapshot = await genreRef.once("value");
        return snapshot.exists();
    }
}