import {IPlaylistBaseService} from "../interface/IPlaylistBaseService.js";
import {database} from "../config/firebase/FireBaseConfig.js";

export const createPlaylist: IPlaylistBaseService['createPlaylist'] = async (title, type, value) => {
    try {
        const playlistRef = database.ref('playlists');

        const playlistData = {
            title,
            type,
            value,
            createdAt: new Date().toISOString(),
        };

        await playlistRef.push(playlistData);
    }catch (error) {
        throw new Error(`Failed to create playlist: ${error.message}`);
    }
}