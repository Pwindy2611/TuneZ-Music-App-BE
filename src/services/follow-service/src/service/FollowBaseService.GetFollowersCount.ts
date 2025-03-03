import {IFollowBaseService} from "../interface/IFollowBaseService";
import {firestore} from "../config/firebase/FireBaseConfig";

export const getFollowersCount: IFollowBaseService["getFollowersCount"] = async (userId) => {
    try {
        const followSnapshot = await firestore
            .collection("users")
            .doc(userId)
            .collection("followers")
            .get();

        return (followSnapshot.empty ? 0 : followSnapshot.size);
    }catch (error) {
        throw new Error(`Failed to get followers count: ${error.message}`);
    }
}