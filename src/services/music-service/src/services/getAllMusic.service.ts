import { database } from "../config/firebase/firebase_config.js";
import {IMusicService} from "./music.service.interface.js";


export const getAllMusic: IMusicService["getAllMusic"] = async () => {
    try {
        const musicRef = database.ref("musics");
        const snapshot = await musicRef.get();

        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            return null;
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error("Error retrieving all music: " + error.message);
        }
        throw new Error("Unknown error occurred while retrieving all music.");
    }
};