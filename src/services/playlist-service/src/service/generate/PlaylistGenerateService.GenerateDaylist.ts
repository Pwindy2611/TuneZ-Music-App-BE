import {IPlaylistGenerateService} from "../../interface/service/IPlaylistGenerateService.js";
import {generateRepo} from "../../repository/PlaylistGenerateRepository.js";
import HistoryBase from "../../util/base/HistoryBase.js";
import FetchBase from "../../util/base/FetchBase.js";
import {MusicResponseDto} from "../../dto/response/MusicResponseDto.js";
import {IPlaylistResponseDto} from "../../dto/response/IPlaylistResponseDto.js";
import PlaylistBaseService from "../base/PlaylistBaseService.js";
import {PlaylistType} from "../../enum/PlaylistType.js";

export const generateDaylist: IPlaylistGenerateService["generateDaylist"] = async (
    userId: string,
    playlistLimit: number
): Promise<IPlaylistResponseDto[] | null> => {
    try {
        if (!await generateRepo.isUserExists(userId)) {
            return Promise.reject(new Error("User not found"));
        }

        // Lấy preferences của người dùng từ lịch sử nghe nhạc
        const { topArtists, topGenres } = await HistoryBase.getUserPreferences(userId);

        // Lấy template playlist từ database
        const daylistTemplates = await PlaylistBaseService.getPlaylistByFilter(PlaylistType.DAYLIST, 'custom');
        if (!daylistTemplates || daylistTemplates.length === 0) {
            return null;
        }

        // Thu thập bài hát từ nghệ sĩ yêu thích
        const artistTracks: Record<string, MusicResponseDto[]> = {};
        const artistLimit = Math.floor(playlistLimit / 2); // Số lượng nghệ sĩ tối đa
        for (const artist of (topArtists || []).slice(0, artistLimit)) {
            const musicIds = await FetchBase.fetchMusicIdsFromArtist(artist, Math.floor(playlistLimit / artistLimit));
            if (musicIds.length > 0) {
                const tracks = await FetchBase.fetchMusicDetails(musicIds);
                artistTracks[artist] = tracks;
            }
        }

        // Thu thập bài hát từ thể loại yêu thích
        const genreTracks: Record<string, MusicResponseDto[]> = {};
        const genreLimit = Math.floor(playlistLimit / 2); // Số lượng thể loại tối đa
        for (const genre of (topGenres || []).slice(0, genreLimit)) {
            const musicIds = await FetchBase.fetchMusicIdsFromGenres(genre, Math.floor(playlistLimit / genreLimit));
            if (musicIds.length > 0) {
                const tracks = await FetchBase.fetchMusicDetails(musicIds);
                genreTracks[genre] = tracks;
            }
        }

        // Tạo các playlist với sự kết hợp
        const playlists: IPlaylistResponseDto[] = [];

        // Playlist 1: Mix nghệ sĩ
        const mixedArtistTracks = Object.values(artistTracks)
            .flatMap(tracks => tracks.slice(0, Math.floor(playlistLimit / Object.keys(artistTracks).length)))
            .sort(() => Math.random() - 0.5);
        if (mixedArtistTracks.length > 0) {
            playlists.push({
                title: daylistTemplates[0].title,
                coverImage: daylistTemplates[0].coverImage || '',
                tracks: mixedArtistTracks
            });
        }

        // Playlist 2: Mix thể loại
        const mixedGenreTracks = Object.values(genreTracks)
            .flatMap(tracks => tracks.slice(0, Math.floor(playlistLimit / Object.keys(genreTracks).length)))
            .sort(() => Math.random() - 0.5);
        if (mixedGenreTracks.length > 0) {
            playlists.push({
                title: daylistTemplates[1]?.title,
                coverImage: daylistTemplates[1]?.coverImage || '',
                tracks: mixedGenreTracks
            });
        }

        // Playlist 3: Mix tổng hợp
        const allTracks = [...Object.values(artistTracks).flat(), ...Object.values(genreTracks).flat()];
        const uniqueTracks = Array.from(new Map(allTracks.map(track => [track._id, track])).values())
            .sort(() => Math.random() - 0.5)
            .slice(0, playlistLimit);
        if (uniqueTracks.length > 0) {
            playlists.push({
                title: daylistTemplates[2]?.title,
                coverImage: daylistTemplates[2]?.coverImage || '',
                tracks: uniqueTracks
            });
        }

        return playlists.length > 0 ? playlists : null;
    } catch (error) {
        throw new Error(`Error generating daylist: ${error.message}`);
    }
}; 