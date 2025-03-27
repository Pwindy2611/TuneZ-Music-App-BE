import "reflect-metadata"
import {container} from "tsyringe";
import {MusicBaseRepository} from "../../repository/MusicBaseRepository.js";
import {MusicUserRepository} from "../../repository/MusicUserRepository.js";
import {MusicStreamRepository} from "../../repository/MusicStreamRepository.js";


const musicBaseRepository = container.resolve(MusicBaseRepository);
const musicUserRepository = container.resolve(MusicUserRepository);
const musicStreamRepository = container.resolve(MusicStreamRepository);

export {musicBaseRepository, musicUserRepository, musicStreamRepository, container}