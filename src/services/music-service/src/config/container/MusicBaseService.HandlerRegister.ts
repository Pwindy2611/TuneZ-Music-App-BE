import { container } from "./Container.js";
import { mediator } from "./Container.js";
import { CreateMusicHandler } from "../../service/handler/CreateMusicHandler.js";
import { UploadMusicByUserHandler } from "../../service/handler/UploadMusicByUserHandler.js";
import { GetAllMusicHandler } from "../../service/handler/GetAllMusicHandler.js";
import { GetMusicByArtistHandler } from "../../service/handler/GetMusicByArtistHandler.js";
import { GetMusicByCategoryHandler } from "../../service/handler/GetMusicByCategoryHandler.js";
import { GetMusicHistoryHandler } from "../../service/handler/GetMusicHistoryHandler.js";
import { GetMusicLoveHandler } from "../../service/handler/GetMusicLoveHandler.js";

import { CreateMusicCommand } from "../../service/command/CreateMusicCommand.js";
import { UploadMusicByUserCommand } from "../../service/command/UploadMusicByUserCommand.js";
import { GetAllMusicQuery } from "../../service/query/GetAllMusicQuery.js";
import { GetMusicByArtistQuery } from "../../service/query/GetMusicByArtistQuery.js";
import { GetMusicByCategoryQuery } from "../../service/query/GetMusicByCategoryQuery.js";
import { GetMusicHistoryQuery } from "../../service/query/GetMusicHistoryQuery.js";
import { GetMusicLoveQuery } from "../../service/query/GetMusicLoveQuery.js";

//Handlers
container.registerSingleton(CreateMusicHandler);
container.registerSingleton(UploadMusicByUserHandler);
container.registerSingleton(GetAllMusicHandler);
container.registerSingleton(GetMusicByArtistHandler);
container.registerSingleton(GetMusicByCategoryHandler);
container.registerSingleton(GetMusicHistoryHandler);
container.registerSingleton(GetMusicLoveHandler);

//Commands
mediator.register(CreateMusicCommand, container.resolve(CreateMusicHandler));
mediator.register(UploadMusicByUserCommand, container.resolve(UploadMusicByUserHandler));

//Queries
mediator.register(GetAllMusicQuery, container.resolve(GetAllMusicHandler));
mediator.register(GetMusicByArtistQuery, container.resolve(GetMusicByArtistHandler));
mediator.register(GetMusicByCategoryQuery, container.resolve(GetMusicByCategoryHandler));
mediator.register(GetMusicHistoryQuery, container.resolve(GetMusicHistoryHandler));
mediator.register(GetMusicLoveQuery, container.resolve(GetMusicLoveHandler));
