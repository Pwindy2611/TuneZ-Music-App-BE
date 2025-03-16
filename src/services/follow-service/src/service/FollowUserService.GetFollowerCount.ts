import {firestore} from "../config/firebase/FireBaseConfig";
import {IFollowUserService} from "../interface/service/IFollowUserService";

export const getFollowerCount: IFollowUserService["getFollowerCount"] = async (userId) => {
    try {
        let userDoc = await firestore.collection('users').doc(userId).get();

        if (!userDoc.exists) {
            userDoc = await firestore.collection('officialArtists').doc(userId).get();
        }

        if (!userDoc.exists) {
            return Promise.reject(new Error('User not found in both users and officialArtist collections'));
        }

        return userDoc.data()?.followerCount || 0;
    } catch (error) {
        throw new Error(`Failed to get follower count: ${error.message}`);
    }
}