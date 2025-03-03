import {IPlaylistBaseRepository} from "../interface/IPlaylistBaseRepository.js";
import {IPlaylist} from "../interface/IPlaylist.js";
import {database} from "../config/firebase/FireBaseConfig.js";

class PlaylistBaseRepository implements IPlaylistBaseRepository {
    async createPlaylist(playlist: IPlaylist): Promise<void> {
        const playlistRef = database.ref('playlists');
        await playlistRef.push(playlist);
    }

    async getPlaylistByFilter(key: string, values: string[] | string): Promise<IPlaylist[]> {
        const playlistRef = database.ref("playlists");
        if (Array.isArray(values)) {
            const playlists: IPlaylist[] = [];

            for (const value of values) {
                const snapshot = await playlistRef.orderByChild(key).equalTo(value).once("value");
                snapshot.forEach((childSnapshot) => {
                    const playlist: IPlaylist = childSnapshot.val();
                    playlists.push(playlist);
                });
            }

            return playlists;
        } else {
            const snapshot = await playlistRef.orderByChild(key).equalTo(values).once("value");
            const playlist = snapshot.val() ? Object.values(snapshot.val())[0] as IPlaylist : null;
            return playlist ? [playlist] : [];
        }
    }
}

export const baseRepo = new PlaylistBaseRepository();