import {IOfficialArtistBaseService} from "../../interface/service/IOfficialArtistBaseService.js";
import {database} from "../../config/firebase/FireBaseConfig.js";

export const getAllOfficialArtists: IOfficialArtistBaseService['getAllOfficialArtists'] = async () => {
    try {
        const artistRef = database.ref("officialArtists");

        const snapshot = await artistRef.once("value");

        if (!snapshot.exists()) {
            return [];
        }

        const officialArtistsObj = snapshot.val();

        const officialArtists: any[] = Object.keys(officialArtistsObj).map(key => ({
            key,
            ...officialArtistsObj[key]
        }));

        const filteredOfficialArtists = officialArtists.filter(artist => artist.verified);

        return filteredOfficialArtists.map(artist => ({
            id: artist.key,
            name: artist.name,
            profile: {
                bio: artist.profile.bio,
                profileImage: artist.profile.profileImage,
                genres: artist.profile.genres
            },
            verified: artist.verified
        }));

    }catch (error){
        console.error("Error in getAllOfficialArtists:", error);
        throw error;
    }
}