import {IMusicBaseService} from "../interface/IMusicBaseService.js";
import {database} from "../config/firebase/FireBaseConfig.js";
import {GetMusicResponseDto} from "../dto/GetMusicResponseDto.js";

export const getMusicByArtist: IMusicBaseService["getMusicByArtist"] = async (artist) => {
    try {
        const musicRef = database.ref("musics");
        const snapshot = await musicRef.orderByChild("artist").equalTo(artist).get();

        if (!snapshot.exists()) {
            return null
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
            throw new Error("Error retrieving music by artist: " + error.message);
        }
        throw new Error("Unknown error occurred while retrieving music by artist.");
    }
};