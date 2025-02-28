import {IMusicRecService} from "../../interface/IMusicRecService.js";
import {firestore} from '../../config/firebase/FireBaseConfig.js'
import { Timestamp } from 'firebase-admin/firestore';
import FetchBase from "../../util/base/FetchBase.js";
import {auth} from "../../config/firebase/FireBaseConfig.js";
import {singleton} from "tsyringe";
import {musicRecMediator} from "../../config/container/Container.js";
import {GenerateThrowBackPlaylistQuery} from "./query/GenerateThrowBackPlaylistQuery.js";
@singleton()
export class GenerateThrowBackPlaylistService {
    execute: IMusicRecService["generateThrowBackPlaylist"] = async (userId: string, playlistLimit: number = 20, historyLimit: number = 100) => {
        return await musicRecMediator.send(new GenerateThrowBackPlaylistQuery(userId, playlistLimit, historyLimit))
    }
}