import {IMusicRecService} from "../interface/IMusicRecService.js";
import {getUserPreferences} from "../utils/base/HistoryBase.js";
import {getMusicByArtist, getMusicByCategory} from "./MusicBaseService.js";
import {GetMusicResponseDto} from "../dto/GetMusicResponseDto.js";
import {auth} from '../config/firebase/FireBaseConfig.js'
export const generateUserPlaylist: IMusicRecService ["generateUserPlayList"] = async (userId) => {
    try{
        if(! await auth.getUser(<string>userId)){
            return Promise.reject(new Error(("Error creating new music: User is not exist")));
        }
        
        const {topArtists, topCategories} = await getUserPreferences(userId)

        if (!topArtists.length && !topCategories.length) {
            return null; // Nếu không có dữ liệu, trả về null
        }

        const artistPromises = topArtists.map(artist =>
            getMusicByArtist(artist).then(songs => ({ artist, songs: songs ?? [] }))
        );

        const categoryPromises = topCategories.map(category =>
            getMusicByCategory(category).then(songs => ({ category, songs: songs ?? [] }))
        );

        const [artistResults, categoryResults] = await Promise.all([
            Promise.all(artistPromises),
            Promise.all(categoryPromises)
        ]);

        const playlistsByArtist: Record<string, GetMusicResponseDto[]> = {};
        artistResults.forEach(({ artist, songs }) => {
            playlistsByArtist[artist] = songs;
        });

        const playlistsByCategory: Record<string, GetMusicResponseDto[]> = {};
        categoryResults.forEach(({ category, songs }) => {
            playlistsByCategory[category] = songs;
        });

        return { playlistsByArtist, playlistsByCategory };
        
    }catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error("Error generating user playlist: " + error.message);
        }
        throw new Error("Unknown error occurred while generating user playlist.");
    }
}