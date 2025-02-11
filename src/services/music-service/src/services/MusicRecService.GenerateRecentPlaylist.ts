import {IMusicRecService} from "../interface/IMusicRecService.js";
import {fetchMusicDetails, fetchMusicIdsFromHistory} from "../utils/base/FetchBase.js";

export const generateRecentPlaylist: IMusicRecService["generateRecentPlaylist"] = async (userId, playlistLimit: number = 20, historyLimit: number = 50) => {
    const musicIds = await fetchMusicIdsFromHistory(userId, historyLimit);

    const musicCount: { [key: string]: number } = {};
    musicIds.forEach(musicId => {
        musicCount[musicId] = (musicCount[musicId] || 0) + 1;
    });

    const sortedMusicIds = Object.entries(musicCount)
        .sort((a, b) => b[1] - a[1])
        .map(entry => entry[0]);

    const topMusicIds = sortedMusicIds.slice(0, playlistLimit);

    return await fetchMusicDetails(topMusicIds);
}
    
