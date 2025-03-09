import "reflect-metadata"
import { container } from "tsyringe";
import { MusicBaseRepository } from "../../repository/MusicBaseRepository.js";
import { MusicBaseMediator } from "../../service/MusicBaseMediator.js";
import {MusicUserMediator} from "../../service/MusicUserMediator.js";


const musicBaseMediator = container.resolve(MusicBaseMediator);
const musicUserMediator = container.resolve(MusicUserMediator);
const musicBaseRepository = container.resolve(MusicBaseRepository);

export {musicBaseMediator, musicUserMediator, musicBaseRepository, container}