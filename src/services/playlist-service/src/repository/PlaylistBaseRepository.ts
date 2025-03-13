import {IPlaylistBaseRepository} from "../interface/repository/IPlaylistBaseRepository.js";
import {IPlaylist} from "../interface/object/IPlaylist.js";
import {database} from "../config/firebase/FireBaseConfig.js";
import {IFile} from "../interface/object/IFile.js";
import UploadBase from "../util/base/UploadBase.js";

class PlaylistBaseRepository implements IPlaylistBaseRepository {
    async createPlaylist(playlist: IPlaylist, imgFile: IFile): Promise<void> {
        try {
            const playlistRef = database.ref("playlists").push();
            const playlistId = playlistRef.key as string;

            let imgPath = "";
            if (imgFile) {
                const uploadImgData = await UploadBase.uploadFile(imgFile, playlistId);
                imgPath = await UploadBase.getSignedFileUrl(uploadImgData) ?? "";
            }

            const newPlaylist: IPlaylist = {
                title: playlist.title,
                type: playlist.type,
                value: playlist.value,
                coverImage: imgPath,
                createdAt: new Date().toISOString(),
            };

            await playlistRef.set(newPlaylist);

        } catch (error) {
            if (error instanceof Error) {
                throw new Error("Error creating new playlist: " + error.message);
            }
            throw new Error("Unknown error occurred while creating new playlist.");
        }
    }
    async updatePlaylist(id: string, playlist: IPlaylist, imgFile?: IFile): Promise<void> {
        const playlistRef = database.ref(`playlists/${id}`);

        const snapshot = await playlistRef.get();
        if (!snapshot.exists()) {
            throw new Error("Playlist not found");
        }

        let imgPath = snapshot.val().coverImage || "";

        if (imgFile) {
            const uploadImgData = await UploadBase.uploadFile(imgFile, id);
            imgPath = await UploadBase.getSignedFileUrl(uploadImgData) ?? "";
        }

        const updatedPlaylist: Partial<IPlaylist> = {
            title: playlist.title,
            type: playlist.type,
            value: playlist.value,
            coverImage: imgPath,
        };

        await playlistRef.update(updatedPlaylist);
    }
    async deletePlaylist(id: string): Promise<void> {
        const playlistRef = database.ref(`playlists/${id}`);
        const snapshot = await playlistRef.get();
        if (!snapshot.exists()) {
            throw new Error("Playlist not found");
        }
        await playlistRef.remove();
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