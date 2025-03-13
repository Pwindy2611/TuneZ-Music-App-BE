import {createUserPlaylist} from "./PlaylistUserService.CreateUserPlaylist.js";
import {updateUserPlaylist} from "./PlaylistUserService.UpdateUserPlaylist.js";
import {deleteUserPlaylist} from "./PlaylistUserService.DeleteUserPlaylist.js";
import {getUserPlaylist} from "./PlaylistUserService.GetUserPlaylist.js";
import {addMusicToUserPlaylist} from "./PlaylistUserService.AddMusicToUserPlaylist.js";
import {removeMusicFromUserPlaylist} from "./PlaylistUserService.RemoveMusicFromUserPlaylist.js";

export class PlaylistUserService {
    createUserPlaylist = createUserPlaylist;
    updateUserPlaylist = updateUserPlaylist;
    deleteUserPlaylist = deleteUserPlaylist;
    getUserPlaylists = getUserPlaylist;
    addMusicToUserPlaylist = addMusicToUserPlaylist;
    removeMusicFromUserPlaylist = removeMusicFromUserPlaylist;
}

export default new PlaylistUserService();