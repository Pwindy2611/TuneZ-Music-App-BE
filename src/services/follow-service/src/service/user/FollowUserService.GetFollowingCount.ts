import {firestore} from "../../config/firebase/FireBaseConfig";
import {IFollowUserService} from "../../interface/service/IFollowUserService";

export const getFollowingCount : IFollowUserService ['getFollowingCount'] = async (userId) => {
    try {
        const userDoc = await firestore.collection('users').doc(userId).get();

        if (!userDoc.exists) {
            return Promise.reject(new Error('User not found'));
        }

        return userDoc.data()?.followingCount || 0;
    } catch (error) {
        throw new Error(`Failed to get following count: ${error.message}`);
    }
}