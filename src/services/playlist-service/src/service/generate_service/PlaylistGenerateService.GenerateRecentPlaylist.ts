import {IPlaylistGenerateService} from "../../interface/IPlaylistGenerateService.js";
import FetchBase from "../../util/base/FetchBase.js";
import {PlaylistBaseService} from "../base/PlaylistBaseService.js";
import PlaylistCacheService from "../base/PlaylistCacheService.js";
import {generateRepo} from "../../repository/PlaylistGenerateRepository.js";

export const generateRecentPlaylist: IPlaylistGenerateService["generateRecentPlaylist"] = async (userId, playlistLimit, historyLimit) => {
    try {
        if (!await generateRepo.isUserExists(userId)) {
            return Promise.reject(new Error("User not found"));
        }

        const cachedPlaylist = await PlaylistCacheService.getFromCache(userId, 'recent');
        if (cachedPlaylist) {
            console.log(`Using cached recent playlist for user: ${userId}`);
            return cachedPlaylist;
        }

        console.log(`Generating new recent playlist for user: ${userId}`);
        const recentPlaylists = await PlaylistBaseService.getPlaylistByFilter('recent', 'custom');

        const recentPlaylist = Array.isArray(recentPlaylists) && recentPlaylists.length > 0 ? recentPlaylists[0] : null;
        if (!recentPlaylist) {
            return null;
        }
        const musicIds = await FetchBase.fetchMusicIdsFromHistory(userId, historyLimit);

        if(!musicIds) return null;

        const musicCount: { [key: string]: number } = {};
        musicIds.forEach(musicId => {
            musicCount[musicId] = (musicCount[musicId] || 0) + 1;
        });

        const sortedMusicIds = Object.entries(musicCount)
            .sort((a, b) => b[1] - a[1])
            .map(entry => entry[0]);

        const topMusicIds = sortedMusicIds.slice(0, playlistLimit);

        const musicDetails = await FetchBase.fetchMusicDetails(topMusicIds);

        const result = musicDetails.length > 0 ? { recentPlaylist: {[recentPlaylist.title] : musicDetails} } : null;

        if (result) {
            await PlaylistCacheService.saveToCache(userId, 'recent', result);
        }

        return result;
    }catch (error) {
        throw new Error(`Error generating recent playlist for user: ${error.message}`);
    }
}