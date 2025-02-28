import "reflect-metadata"
import { container } from "tsyringe";
import { MusicBaseRepository } from "../../repository/MusicBaseRepository.js";
import { MusicBaseMediator } from "../../service/MusicBaseMediator.js";
import {MusicRecMediator} from "../../service/MusicRecMediator.js";


const musicBaseMediator = container.resolve(MusicBaseMediator);
const musicRecMediator = container.resolve(MusicRecMediator);
const musicBaseRepository = container.resolve(MusicBaseRepository);

export {musicBaseMediator, musicRecMediator, musicBaseRepository, container}