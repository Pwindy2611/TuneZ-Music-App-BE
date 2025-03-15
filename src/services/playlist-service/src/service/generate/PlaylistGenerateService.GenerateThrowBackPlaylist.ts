import {IPlaylistGenerateService} from "../../interface/service/IPlaylistGenerateService.js";
import FetchBase from "../../util/base/FetchBase.js";
import PlaylistBaseService from "../base/PlaylistBaseService.js";
import PlaylistCacheService from "../cache/PlaylistCacheService.js";
import {generateRepo} from "../../repository/PlaylistGenerateRepository.js";
import {IPlaylistResponseDto} from "../../dto/response/IPlaylistResponseDto.js";

export const generateThrowBackPlaylist: IPlaylistGenerateService["generateThrowBackPlaylist"] = async (
    userId,
    playlistLimit,
    historyLimit
): Promise<IPlaylistResponseDto[] | null> => {
    try {
        const throwbackPlaylists = await PlaylistBaseService.getPlaylistByFilter('throwback', 'custom');

        if (!Array.isArray(throwbackPlaylists) || throwbackPlaylists.length === 0) {
            return null;
        }

        const throwbackPlaylist = throwbackPlaylists[0];
        const musicIds = await generateRepo.getThrowBackMusicIds(userId, historyLimit);
        if (!musicIds || musicIds.length === 0) return null;

        // Đếm số lần phát của từng bài hát
        const frequencyMap: Record<string, number> = {};
        musicIds.forEach(id => {
            frequencyMap[id] = (frequencyMap[id] || 0) + 1;
        });

        // Sắp xếp bài hát theo tần suất nghe, lấy top `playlistLimit`
        const sortedIds = Object.entries(frequencyMap)
            .sort((a, b) => b[1] - a[1])
            .map(([id]) => id)
            .slice(0, playlistLimit);

        const musicDetails = await FetchBase.fetchMusicDetails(sortedIds);
        if (musicDetails.length === 0) return null;

        const playlistResponse: IPlaylistResponseDto = {
            title: throwbackPlaylist.title,
            coverImage: throwbackPlaylist.coverImage || 'https://example.com/default-cover.jpg', // Ảnh mặc định nếu thiếu
            tracks: musicDetails
        };

        return [playlistResponse];
    } catch (error) {
        throw new Error(`Error generating throwback playlist: ${error.message}`);
    }
};

