import "reflect-metadata"
import { container } from "tsyringe";
import { MusicBaseRepository } from "../../repository/MusicBaseRepository.js";
import { Mediator } from "../../service/mediator/Mediator.js";

//REPOSITORIES
container.registerSingleton(MusicBaseRepository);
container.registerSingleton(Mediator);

const mediator = container.resolve(Mediator) ;
const repository = container.resolve(MusicBaseRepository);

export {mediator, repository, container}