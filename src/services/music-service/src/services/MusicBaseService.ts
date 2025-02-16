import { createMusic } from "./MusicBaseService.CreateMusic.js";
import { getAllMusic } from "./MusicBaseService.GetAllMusic.js";
import { getMusicByArtist } from "./MusicBaseService.GetMusicByArtist.js";
import { getMusicByCategory } from "./MusicBaseService.GetMusicByCategory.js";
import { getMusicHistory } from "./MusicBaseService.GetMusicHistory.js";
import { uploadMusicByUser } from "./MusicBaseService.UploadMusicByUser.js";

export const MusicBaseService = {
    createMusic,
    getAllMusic,
    getMusicByArtist,
    getMusicByCategory,
    getMusicHistory,
    uploadMusicByUser,
    
}