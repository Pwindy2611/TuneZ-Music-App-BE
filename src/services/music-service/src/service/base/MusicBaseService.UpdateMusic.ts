import {IMusicBaseService} from "../../interface/service/IMusicBaseService.js";
import {musicBaseRepository} from "../../config/container/Container.js";
import { Lifecycle, scoped } from "tsyringe";
import {IMusic} from "../../interface/object/IMusic.js";
import {IMusicFile} from "../../interface/object/IMusicFile.js";

@scoped(Lifecycle.ResolutionScoped)
export class UpdateMusicService {
    execute: IMusicBaseService["updateMusic"] = async (id, music, musicFile?, imgFile?) => {
        const updateData: Partial<IMusic> = {
            name: music.name,
            artist: music.artist,
            duration: music.duration,
            genres: music.genres,
            officialArtistId: music.officialArtistId,
            userId: music.userId,
            lyrics: music.lyrics
        };

        if (musicFile) {
            updateData.musicPath = await musicBaseRepository.uploadMusicFile(id, musicFile);
        }

        if (imgFile) {
            updateData.imgPath = await musicBaseRepository.uploadMusicFile(id, imgFile);
        }

        return await musicBaseRepository.updateMusic(id, updateData);
    };
}
