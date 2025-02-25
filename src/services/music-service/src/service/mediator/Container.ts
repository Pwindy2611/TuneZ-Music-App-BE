import "reflect-metadata"
import { container } from "tsyringe";
import { CreateMusicCommand } from "../command/CreateMusicCommand.js";
import { CreateMusicHandler } from "../handler/CreateMusicHandler.js";
import { MusicBaseRepository } from "../../repository/MusicBaseRepository.js";
import { Mediator } from "./Mediator.js";
import {GetAllMusicHandler} from "../handler/GetAllMusicHandler.js";
import {GetAllMusicQuery} from "../query/GetAllMusicQuery.js";
import {GetMusicByArtistHandler} from "../handler/GetMusicByArtistHandler.js";
import {GetMusicByArtistQuery} from "../query/GetMusicByArtistQuery.js";
import {GetMusicByCategoryHandler} from "../handler/GetMusicByCategoryHandler.js";
import {GetMusicByCategoryQuery} from "../query/GetMusicByCategoryQuery.js";

container.registerSingleton(MusicBaseRepository);
container.registerSingleton(Mediator);
container.registerSingleton(CreateMusicHandler);
container.registerSingleton(GetAllMusicHandler);
container.registerSingleton(GetMusicByArtistHandler);
container.registerSingleton(GetMusicByCategoryHandler);

const mediator = container.resolve(Mediator) ;
const repository = container.resolve(MusicBaseRepository);

mediator.register(CreateMusicCommand, container.resolve(CreateMusicHandler));
mediator.register(GetAllMusicQuery, container.resolve(GetAllMusicHandler));
mediator.register(GetMusicByArtistQuery, container.resolve(GetMusicByArtistHandler));
mediator.register(GetMusicByCategoryQuery, container.resolve(GetMusicByCategoryHandler));

export {mediator, repository}