import { container } from "./Container.js";
import {musicUserMediator} from "./Container.js";
import {UploadMusicByUserCommand} from "../../service/music_user/command/UploadMusicByUserCommand.js";
import {UploadMusicByUserHandler} from "../../service/music_user/handler/UploadMusicByUserHandler.js";
import {GetMusicHistoryHandler} from "../../service/music_user/handler/GetMusicHistoryHandler.js";
import {GetMusicHistoryQuery} from "../../service/music_user/query/GetMusicHistoryQuery.js";
import {GetMusicLoveQuery} from "../../service/music_user/query/GetMusicLoveQuery.js";
import {GetMusicLoveHandler} from "../../service/music_user/handler/GetMusicLoveHandler.js";

//Commands
musicUserMediator.register(UploadMusicByUserCommand, container.resolve(UploadMusicByUserHandler))

//Queries
musicUserMediator.register(GetMusicHistoryQuery, container.resolve(GetMusicHistoryHandler))
musicUserMediator.register(GetMusicLoveQuery, container.resolve(GetMusicLoveHandler))