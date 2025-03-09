import {firestore} from "../config/firebase/FireBaseConfig";
import {IFollowUserService} from "../interface/service/IFollowUserService";

export const getFollowersCount: IFollowUserService["getFollowersCount"] = async (userId) => {
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