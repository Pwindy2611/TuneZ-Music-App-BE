import "reflect-metadata"
import {container} from "tsyringe";
import {MusicBaseRepository} from "../../repository/MusicBaseRepository.js";
import {MusicBaseMediator} from "../../service/MusicBaseMediator.js";
import {MusicUserMediator} from "../../service/MusicUserMediator.js";
import {MusicUserRepository} from "../../repository/MusicUserRepository.js";
import {MusicStreamMediator} from "../../service/MusicStreamMediator.js";
import {MusicStreamRepository} from "../../repository/MusicStreamRepository.js";


const musicBaseMediator = container.resolve(MusicBaseMediator);
const musicUserMediator = container.resolve(MusicUserMediator);
const musicStreamMediator = container.resolve(MusicStreamMediator);
const musicBaseRepository = container.resolve(MusicBaseRepository);
const musicUserRepository = container.resolve(MusicUserRepository);
const musicStreamRepository = container.resolve(MusicStreamRepository);

export {musicBaseMediator, musicUserMediator,musicStreamMediator, musicBaseRepository, musicUserRepository, musicStreamRepository, container}