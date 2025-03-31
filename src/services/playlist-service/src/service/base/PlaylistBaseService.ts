import {createPlaylist} from "./PlaylistBaseService.CreatePlaylist.js";
import {getPlaylistByFilter} from "./PlaylistBaseService.GetPlaylistByFilter.js";
import {updatePlaylist} from "./PlaylistBaseService.UpdatePlaylist.js";
import {deletePlaylist} from "./PlaylistBaseService.DeletePlaylist.js";
import {IPlaylistBaseService} from "../../interface/service/IPlaylistBaseService.js";
import {getAllPlaylists} from "./PlaylistBaseService.GetAllPlaylist.js";
class PlaylistBaseService implements IPlaylistBaseService{
    createPlaylist = createPlaylist;
    updatePlaylist= updatePlaylist;
    deletePlaylist = deletePlaylist;
    getPlaylistByFilter = getPlaylistByFilter;
    getAllPlaylists = getAllPlaylists;

}
export default new PlaylistBaseService();