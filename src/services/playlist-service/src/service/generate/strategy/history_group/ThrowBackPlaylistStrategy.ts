import {IPlaylistStrategy} from "../../../../interface/object/IPlaylistStrategy.js";
import {generateThrowBackPlaylist} from "../../PlaylistGenerateService.GenerateThrowBackPlaylist.js";

export class ThrowBackPlaylistStrategy implements IPlaylistStrategy {
    generate(userId: string): Promise<any> {
        return generateThrowBackPlaylist(userId, 20 , 100)
    }
}