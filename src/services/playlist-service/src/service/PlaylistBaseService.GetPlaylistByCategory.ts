import {IPlaylistBaseService} from "../interface/IPlaylistBaseService.js";
import {database} from "../config/firebase/FireBaseConfig.js";
import {IPlaylist} from "../interface/IPlaylist.js";

export const getPlaylistByCategory: IPlaylistBaseService["getPlaylistByCategory"] = async (categories) => {
    try {
        const playlistRef = database.ref('playlists');

        const playlists: IPlaylist[] = [];
        for (const category of categories) {
            const snapshot = await playlistRef.orderByChild('value').equalTo(category).once('value');

            snapshot.forEach((childSnapshot) => {
                const playlist: IPlaylist = childSnapshot.val();
                playlists.push(playlist);
            });
        }

        return playlists;
    }catch (error) {
        throw new Error(`Failed to get playlist by category: ${error.message}`);
    }
}