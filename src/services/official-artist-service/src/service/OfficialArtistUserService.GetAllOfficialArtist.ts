import {database, firestore} from "../config/firebase/FireBaseConfig.js";
import {IOfficialArtist} from "../interface/object/IOfficialArtist.js";
import {IOfficialArtistUserService} from "../interface/service/IOfficialArtistUserService.js";

export const getAllOfficialArtist: IOfficialArtistUserService["getAllOfficialArtists"] = async (userId) => {
    try {
        if (!userId) {
            return Promise.reject(new Error('User ID is required')) ;
        }

        const followRef = await firestore
            .collection('users')
            .doc(userId)
            .collection('following')
            .where('followType', '==', 'officialArtist')
            .get();

        const followingIds = followRef.docs.map(doc  => doc.data().followingId);

        const officialRef = database.ref('officialArtists');
        const snapshot = await officialRef.get();

        if (!snapshot.exists()) {
            return [];
        }
        const officialArtistsObj = snapshot.val();

        const officialArtists: any[] = Object.keys(officialArtistsObj).map(key => ({
            key,
            ...officialArtistsObj[key]
        }));

        const filteredOfficialArtists : IOfficialArtist[] = officialArtists.filter(artist => !followingIds.includes(artist.key));

        return filteredOfficialArtists;
    }catch (error) {
        throw new Error(`Failed to get all official artists ${error.message}`);
    }
}