import {createPlaylist} from "./PlaylistBaseService.CreatePlaylist.js";
import {getSystemPlaylist} from "./PlaylistBaseService.GetSystemPlaylist.js";
import {getPlaylistByArtist} from "./PlaylistBaseSerivce.GetPlaylistByArtist.js";
import {getPlaylistByCategory} from "./PlaylistBaseService.GetPlaylistByCategory.js";

export const PlaylistBaseService = {
    createPlaylist,
    getSystemPlaylist,
    getPlaylistByArtist,
    getPlaylistByCategory
}