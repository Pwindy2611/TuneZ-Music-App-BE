import { IPlaylistUserService } from "../../interface/service/IPlaylistUserService.js";
import { playlistUserRepository } from "../../repository/PlaylistUserRepository.js";

export const getUserPlaylist: IPlaylistUserService['getUserPlaylists'] = async (userId) => {
    try {
        const playlists = await playlistUserRepository.getUserPlaylists(userId);
        return playlists.map(playlist => ({
            id: playlist.id,
            title: playlist.title,
            coverImg: playlist.coverImage || '',
            musicCount: playlist.musicIds ? playlist.musicIds.length : 0
        }));
    } catch (error) {
        throw new Error(`Failed to get user playlists: ${error.message}`);
    }
}