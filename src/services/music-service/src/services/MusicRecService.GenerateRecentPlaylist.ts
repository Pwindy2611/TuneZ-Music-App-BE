import {IMusicRecService} from "../interface/IMusicRecService.js";
import {fetchMusicDetails, fetchMusicIdsFromHistory} from "../utils/base/FetchBase.js";
import {auth} from "../config/firebase/FireBaseConfig.js";

export const generateRecentPlaylist: IMusicRecService["generateRecentPlaylist"] = async (userId, playlistLimit: number = 20, historyLimit: number = 50) => {
    try {
        if(! await auth.getUser(<string>userId)){
            return Promise.reject(new Error(("Error creating new music: User is not exist")));
        }
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
    catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error("Error generating user playlist: " + error.message);
        }
        throw new Error("Unknown error occurred while generating recent playlist.");
    }
}
    
