import "reflect-metadata"
import { container } from "tsyringe";
import { MusicBaseRepository } from "../../repository/MusicBaseRepository.js";
import { MusicBaseMediator } from "../../service/MusicBaseMediator.js";


const musicBaseMediator = container.resolve(MusicBaseMediator);
const musicBaseRepository = container.resolve(MusicBaseRepository);

export {musicBaseMediator, musicBaseRepository, container}