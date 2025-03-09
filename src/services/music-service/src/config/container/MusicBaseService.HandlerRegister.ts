import { container } from "./Container.js";
import { musicBaseMediator } from "./Container.js";
import { CreateMusicHandler } from "../../service/music_base/handler/CreateMusicHandler.js";
import { UploadMusicByUserHandler } from "../../service/music_user/handler/UploadMusicByUserHandler.js";
import { GetAllMusicHandler } from "../../service/music_base/handler/GetAllMusicHandler.js";
import { GetMusicByArtistHandler } from "../../service/music_base/handler/GetMusicByArtistHandler.js";
import { GetMusicByGenresHandler } from "../../service/music_base/handler/GetMusicByGenresHandler.js";
import { GetMusicHistoryHandler } from "../../service/music_user/handler/GetMusicHistoryHandler.js";
import { GetMusicLoveHandler } from "../../service/music_user/handler/GetMusicLoveHandler.js";

import { CreateMusicCommand } from "../../service/music_base/command/CreateMusicCommand.js";
import { UploadMusicByUserCommand } from "../../service/music_user/command/UploadMusicByUserCommand.js";
import { GetAllMusicQuery } from "../../service/music_base/query/GetAllMusicQuery.js";
import { GetMusicByArtistQuery } from "../../service/music_base/query/GetMusicByArtistQuery.js";
import { GetMusicByGenresQuery } from "../../service/music_base/query/GetMusicByGenresQuery.js";
import { GetMusicHistoryQuery } from "../../service/music_user/query/GetMusicHistoryQuery.js";
import { GetMusicLoveQuery } from "../../service/music_user/query/GetMusicLoveQuery.js";

//Commands
musicBaseMediator.register(CreateMusicCommand, container.resolve(CreateMusicHandler));
musicBaseMediator.register(UploadMusicByUserCommand, container.resolve(UploadMusicByUserHandler));

//Queries
musicBaseMediator.register(GetAllMusicQuery, container.resolve(GetAllMusicHandler));
musicBaseMediator.register(GetMusicByArtistQuery, container.resolve(GetMusicByArtistHandler));
musicBaseMediator.register(GetMusicByGenresQuery, container.resolve(GetMusicByGenresHandler));
musicBaseMediator.register(GetMusicHistoryQuery, container.resolve(GetMusicHistoryHandler));
musicBaseMediator.register(GetMusicLoveQuery, container.resolve(GetMusicLoveHandler));
