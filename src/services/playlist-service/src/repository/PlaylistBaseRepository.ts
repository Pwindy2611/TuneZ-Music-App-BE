import {IPlaylistBaseRepository} from "../interface/repository/IPlaylistBaseRepository.js";
import {IPlaylist} from "../interface/object/IPlaylist.js";
import {database} from "../config/firebase/FireBaseConfig.js";

class PlaylistBaseRepository implements IPlaylistBaseRepository {
    async createPlaylist(playlist: IPlaylist): Promise<void> {
        const playlistRef = database.ref('playlists');
        await playlistRef.push(playlist);
    }

    async getPlaylistByFilter(values: string[] | string, type: string): Promise<IPlaylist[]> {
        const playlistRef = database.ref("playlists");

        const snapshot = await playlistRef.orderByChild("type").equalTo(type).once("value");

        if (!snapshot.exists()) return [];

        const allPlaylists: IPlaylist[] = Object.values(snapshot.val());

        const valueArray = Array.isArray(values) ? values : [values];

        return allPlaylists.filter(playlist => valueArray.includes(playlist.value));
    }
}

export const baseRepo = new PlaylistBaseRepository();