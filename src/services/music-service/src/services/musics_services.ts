import { database } from '../config/firebase/firebase_config.js';
import { generateId } from "../utils/helpers/authentication_helper.js";

export const createMusicService = async (music: { name: string; artist: string; duration: number; category: string }) => {
    try {
        const musicId = generateId();
        const musicRef = database.ref(`musics/${musicId}`);
        const loveCount = 0;
        const playCount = 0;

        await musicRef.set({
            musicId,
            ...music,
            loveCount,
            playCount,
        });

        return musicId;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error("Error creating new music: " + error.message);
        }
        throw new Error("Unknown error occurred while creating new music.");
    }
};

export const getAllMusicService = async () => {
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

export const getMusicByArtistService = async (artist: string) => {
    try {
        const musicRef = database.ref("musics");
        const snapshot = await musicRef.orderByChild("artist").equalTo(artist).get();

        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            return null;
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error("Error retrieving music by artist: " + error.message);
        }
        throw new Error("Unknown error occurred while retrieving music by artist.");
    }
};

export const getMusicByCategoryService = async (category: string) => {
    try {
        const musicRef = database.ref("musics");
        const snapshot = await musicRef.orderByChild("category").equalTo(category).get();

        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            return null;
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error("Error retrieving music by category: " + error.message);
        }
        throw new Error("Unknown error occurred while retrieving music by category.");
    }
};