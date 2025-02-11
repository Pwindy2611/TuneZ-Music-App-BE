import { database } from "../config/firebase/FireBaseConfig.js";
import {IMusicBaseService} from "../interface/IMusicBaseService.js";
import {GetMusicResponseDto} from "../dto/GetMusicResponseDto.js";


export const getAllMusic: IMusicBaseService["getAllMusic"] = async () => {
    try {
        const musicRef = database.ref("musics");
        const snapshot = await musicRef.get();

        if (!snapshot.exists()) {
            return snapshot.val();
        }

        const musicData = snapshot.val()
        return Object.values(musicData).map(music => {
            const { name, songType, artist, duration, category, loveCount, playCount, musicPath, imgPath} = music as {
                name: string;
                artist: string;
                duration: number;
                category: string;
                loveCount: number;
                playCount: number;
                musicPath: string;
                imgPath: string;
                songType: string;
            }
            return new GetMusicResponseDto(name, artist, duration, category, loveCount, playCount, musicPath, imgPath, songType);
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error("Error retrieving all music: " + error.message);
        }
        throw new Error("Unknown error occurred while retrieving all music.");
    }
};