import {IPlaylistGenerateService} from "../../interface/IPlaylistGenerateService.js";
import FetchBase from "../../util/base/FetchBase.js";
import {PlaylistBaseService} from "../base/PlaylistBaseService.js";
import PlaylistCacheService from "../base/PlaylistCacheService.js";
import {generateRepo} from "../../repository/PlaylistGenerateRepository.js";

export const generateThrowBackPlaylist: IPlaylistGenerateService["generateThrowBackPlaylist"] = async (userId, playlistLimit, historyLimit) => {
    try {
        if(!await generateRepo.isUserExists(userId)) {
            return Promise.reject(new Error("User not found"));
        }

        const cachedPlaylist = await PlaylistCacheService.getFromCache(userId, 'throwback');
        if (cachedPlaylist) {
            console.log(`Using cached throwback playlist for user: ${userId}`);
            return cachedPlaylist;
        }

        console.log(`Generating new throwback playlist for user: ${userId}`);
        const throwbackPlaylists = await PlaylistBaseService.getPlaylistByFilter('value', 'throwback');

        const throwbackPlaylist = Array.isArray(throwbackPlaylists) && throwbackPlaylists.length > 0 ? throwbackPlaylists[0] : null;
        if (!throwbackPlaylist) {
            return null;
        }

        const musicIds = await generateRepo.getThrowBackMusicIds(userId, historyLimit);

        if(musicIds.length <= 0){
            return null;
        }

        const frequencyMap: Record<string, number> = {};
        musicIds.forEach(id => {
            frequencyMap[id] = (frequencyMap[id] || 0) + 1;
        });

        const sortedIds = Object.entries(frequencyMap)
            .sort((a, b) => b[1] - a[1])
            .map(([id]) => id)
            .slice(0, playlistLimit);

        const musicDetails = await FetchBase.fetchMusicDetails(sortedIds);
        const result = musicDetails.length > 0 ? {throwbackPlaylist: {[throwbackPlaylist.title]: musicDetails}} : null;

        if (result) {
            await PlaylistCacheService.saveToCache(userId, 'throwback', result);
        }

        return result;
    }catch (error) {
        throw new Error(`Error generating throwback playlist ${error.message}`);
    }
}