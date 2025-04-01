import {IPlaylistGenerateService} from "../../interface/service/IPlaylistGenerateService.js";
import FetchBase from "../../util/base/FetchBase.js";
import PlaylistBaseService from "../base/PlaylistBaseService.js";
import {IPlaylistResponseDto} from "../../dto/response/IPlaylistResponseDto.js";
import { PlaylistType } from "../../enum/PlaylistType.js";

export const generateRecentPlaylist: IPlaylistGenerateService["generateRecentPlaylist"] = async (
    userId,
    playlistLimit,
    historyLimit
): Promise<IPlaylistResponseDto[] | null> => {
    try {

        const recentPlaylists = await PlaylistBaseService.getPlaylistByFilter(PlaylistType.RECENT, 'custom');

        if (!Array.isArray(recentPlaylists) || recentPlaylists.length === 0) {
            return null;
        }

        const recentPlaylist = recentPlaylists[0];
        const musicIds = await FetchBase.fetchMusicIdsFromHistory(userId, historyLimit);
        if (!musicIds || musicIds.length === 0) return null;

        const musicCount: Record<string, number> = {};
        musicIds.forEach(musicId => {
            musicCount[musicId] = (musicCount[musicId] || 0) + 1;
        });

        const sortedMusicIds = Object.entries(musicCount)
            .sort((a, b) => b[1] - a[1])
            .map(entry => entry[0])
            .slice(0, playlistLimit);

        const musicDetails = await FetchBase.fetchMusicDetails(sortedMusicIds);

        if (musicDetails.length === 0) return null;

        const playlistResponse: IPlaylistResponseDto = {
            title: recentPlaylist.title,
            coverImage: recentPlaylist.coverImage || 'https://example.com/default-cover.jpg', // Giá trị mặc định
            tracks: musicDetails
        };

        return [playlistResponse];
    } catch (error) {
        throw new Error(`Error generating recent playlist for user: ${error.message}`);
    }
};

