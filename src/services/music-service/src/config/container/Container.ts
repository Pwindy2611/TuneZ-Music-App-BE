import "reflect-metadata"
import {container} from "tsyringe";
import {MusicBaseRepository} from "../../repository/MusicBaseRepository.js";
import {MusicUserRepository} from "../../repository/MusicUserRepository.js";
import {MusicStreamRepository} from "../../repository/MusicStreamRepository.js";
import {MusicStreamService} from "../../service/stream/MusicStreamService.js";

const musicBaseRepository = container.resolve(MusicBaseRepository);
const musicUserRepository = container.resolve(MusicUserRepository);
const musicStreamRepository = container.resolve(MusicStreamRepository);
const musicStreamService = container.resolve(MusicStreamService);

export {musicBaseRepository, musicUserRepository, musicStreamRepository, musicStreamService, container}