import {generateUniquePlaylist} from "../../PlaylistGenerateService.GenerateUniquePlaylist.js";

export class UniquePlaylistStrategy{
    generate(userId:string){
        return generateUniquePlaylist(userId, 20, 100)
    }
}