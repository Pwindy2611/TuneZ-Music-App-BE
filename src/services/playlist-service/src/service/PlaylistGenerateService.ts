import {PlaylistFactory} from "./factory/PlaylistFactory.js";

class PlaylistGenerateService {
    async generate(userId: string) {
        const playlistGroups = await PlaylistFactory.getPlaylistGroup(userId);

        let playlists: any[] = [];
        for(const group of playlistGroups) {
            const generatedPlaylist = await group.generatePlaylist(userId);
            playlists = playlists.concat(generatedPlaylist);
        }
        return playlists;
    }
}

export default new PlaylistGenerateService();