import {IMusicBaseService} from "../interface/IMusicBaseService.js";
import {database} from "../config/firebase/FireBaseConfig.js";
import FetchBase from "../util/base/FetchBase.js";
import {child} from "@firebase/database";

export const getMusicByCategory: IMusicBaseService["getMusicByCategory"] = async (category) => {
    try {
        const musicRef = database.ref("musics");
        const snapshot = await musicRef.orderByChild("category").equalTo(category).get();

        if (!snapshot.exists()) {
            return snapshot.val();
        }

        let musicIds: string[] = [];

        snapshot.forEach(child => {
            if(child.val().songType?.toString() === "official"){
                musicIds.push(child.val().musicId?.toString());
            }
        })

        return await FetchBase.fetchMusicDetails(musicIds);
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error("Error retrieving music by category: " + error.message);
        }
        throw new Error("Unknown error occurred while retrieving music by category.");
    }
};