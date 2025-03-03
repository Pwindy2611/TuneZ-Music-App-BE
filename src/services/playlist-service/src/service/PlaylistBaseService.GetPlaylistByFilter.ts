import {IPlaylistBaseService} from "../interface/IPlaylistBaseService.js";
import {database} from "../config/firebase/FireBaseConfig.js";
import {IPlaylist} from "../interface/IPlaylist.js";

export const getPlaylistByFilter: IPlaylistBaseService["getPlaylistByFilter"] = async (key, values) => {
    try {
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
    } catch (error) {
        throw new Error(`Failed to get playlist by ${key}: ${error.message}`);
    }
}