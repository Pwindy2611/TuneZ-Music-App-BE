import {IFollowBaseService} from "../interface/IFollowBaseService";
import {firestore} from "../config/firebase/FireBaseConfig";

export const getFollowingCount : IFollowBaseService ['getFollowingCount'] = async (userId) => {
    try{
        const followSnapshot = await firestore
            .collection('users')
            .doc(userId)
            .collection('following')
            .get();

        return (followSnapshot.empty ? 0 : followSnapshot.size);

    }catch (error) {
        throw new Error(`Failed to get following count: ${error.message}`);
    }
}