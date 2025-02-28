import { container } from "./Container.js";
import { musicRecMediator } from "./Container.js";
import {
    GenerateFollowedArtistsPlaylistQuery
} from "../../service/music_rec/query/GenerateFollowedArtistsPlaylistQuery.js";
import {
    GenerateFollowedArtistsPlaylistHandler
} from "../../service/music_rec/handler/GenerateFollowedArtistsPlaylistHandler.js";
import {GenerateRecentPlaylistQuery} from "../../service/music_rec/query/GenerateRecentPlaylistQuery.js";
import {GenerateRecentPlaylistHandler} from "../../service/music_rec/handler/GenerateRecentPlaylistHandler.js";
import {GenerateThrowBackPlaylistQuery} from "../../service/music_rec/query/GenerateThrowBackPlaylistQuery.js";
import {GenerateThrowBackPlaylistHandler} from "../../service/music_rec/handler/GenerateThrowBackPlaylistHandler.js";
import {GenerateUserPlaylistQuery} from "../../service/music_rec/query/GenerateUserPlaylistQuery.js";
import {GenerateUserPlaylistHandler} from "../../service/music_rec/handler/GenerateUserPlaylistHandler.js";

//Queries
musicRecMediator.register(GenerateFollowedArtistsPlaylistQuery, container.resolve(GenerateFollowedArtistsPlaylistHandler));
musicRecMediator.register(GenerateRecentPlaylistQuery, container.resolve(GenerateRecentPlaylistHandler));
musicRecMediator.register(GenerateThrowBackPlaylistQuery, container.resolve(GenerateThrowBackPlaylistHandler));
musicRecMediator.register(GenerateUserPlaylistQuery, container.resolve(GenerateUserPlaylistHandler));