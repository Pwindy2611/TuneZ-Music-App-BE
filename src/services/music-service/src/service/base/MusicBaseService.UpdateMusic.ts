import {IMusicBaseService} from "../../interface/service/IMusicBaseService.js";
import {musicBaseRepository} from "../../config/container/Container.js";
import { Lifecycle, scoped } from "tsyringe";
import {IMusic} from "../../interface/object/IMusic.js";
import {IMusicFile} from "../../interface/object/IMusicFile.js";
import { IMusicGenre } from "../../interface/object/IMusicGenre.js";

@scoped(Lifecycle.ResolutionScoped)
export class UpdateMusicService {
    execute: IMusicBaseService["updateMusic"] = async (id, music, musicFile?, imgFile?) => {
        // Kiểm tra music tồn tại
        const existingMusic = await musicBaseRepository.getMusicById(id);
        if (!existingMusic) {
            return Promise.reject(new Error("Music not found"));
        }

        // Validate genres nếu có cập nhật
        if (music.genres) {
            if (!Array.isArray(music.genres) || music.genres.length === 0) {
                return Promise.reject(new Error("Music must have at least one genre"));
            }
        }

        // Cập nhật thông tin music
        const updateData: Partial<IMusic> = {
            name: music.name || existingMusic.name,
            artist: music.artist || existingMusic.artist,
            duration: music.duration || existingMusic.duration,
            lyrics: music.lyrics || existingMusic.lyrics,
            genres: music.genres || existingMusic.genres,
            ...(music.userId && { userId: music.userId }),
            ...(music.officialArtistId && { officialArtistId: music.officialArtistId })
        };

        // Cập nhật file nếu có
        if (musicFile) {
            updateData.musicPath = await musicBaseRepository.uploadMusicFile(id, musicFile);
        }

        if (imgFile) {
            updateData.imgPath = await musicBaseRepository.uploadMusicFile(id, imgFile);
        }

        return await musicBaseRepository.updateMusic(id, updateData);
    };
}
