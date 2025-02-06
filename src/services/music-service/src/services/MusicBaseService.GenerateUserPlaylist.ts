import {IMusicBaseService} from "../interface/IMusicBaseService.js";
import {getUserPreferences} from "../utils/base/HistoryBase.js";
import {getMusicByArtist, getMusicByCategory} from "./MusicBaseService.js";
import {GetMusicResponseDto} from "../dto/GetMusicResponseDto.js";

export const generateUserPlaylist: IMusicBaseService ["generateUserPlayList"] = async (userId) => {
    try{
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