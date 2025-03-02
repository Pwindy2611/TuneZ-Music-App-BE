import {IPlaylistBaseService} from "../interface/IPlaylistBaseService.js";
import {database} from "../config/firebase/FireBaseConfig.js";
import {IPlaylist} from "../interface/IPlaylist.js";

export const getSystemPlaylist: IPlaylistBaseService["getSystemPlaylist"] = async () => {
    try {
        const systemPlaylistRef = database.ref('playlists');
        const systemPlaylistSnapshot = await systemPlaylistRef.once('value');
        const systemPlaylistsData = systemPlaylistSnapshot.val();

        if (!systemPlaylistsData) {
            return [];
        }

        const systemPlaylists: IPlaylist[] = Object.entries(systemPlaylistsData).map(([key, value]: [string, any]) => ({
            title: value.title,
            type: value.type,
            value: value.value
        }));

        return systemPlaylists;

    }catch (error) {
        throw new Error("Failed to retrieve user's playlists");
    }
}