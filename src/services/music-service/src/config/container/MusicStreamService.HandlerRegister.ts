import {container, musicStreamMediator} from "./Container.js";
import {GetUserMusicStateQuery} from "../../service/music_stream/query/GetUserMusicStateQuery.js";
import {GetUserMusicStateHandler} from "../../service/music_stream/handler/GetUserMusicStateHandler.js";
import {GetStreamMusicQuery} from "../../service/music_stream/query/GetStreamMusicQuery.js";
import {GetStreamMusicHandler} from "../../service/music_stream/handler/GetStreamMusicHandler.js";
import {UpdateUserMusicStateCommand} from "../../service/music_stream/command/UpdateUserMusicStateCommand.js";
import {UpdateUserMusicStateHandler} from "../../service/music_stream/handler/UpdateUserMusicStateHandler.js";

musicStreamMediator.register(GetUserMusicStateQuery, container.resolve(GetUserMusicStateHandler));
musicStreamMediator.register(GetStreamMusicQuery, container.resolve(GetStreamMusicHandler));

musicStreamMediator.register(UpdateUserMusicStateCommand, container.resolve(UpdateUserMusicStateHandler));
